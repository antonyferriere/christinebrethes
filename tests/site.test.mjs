import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { prepareEmail } from '../src/scripts/contact.js';
import { linkedinSections } from '../src/components/sections.mjs';
import { recommendations, publications, linkedinSettings } from '../src/data/linkedin.mjs';
import { site } from '../src/data/site.mjs';
function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}
const files = filesIn('dist');
const pages = files.filter((path) => extname(path) === '.html');

test('toutes les pages ont un titre, un H1 et des métadonnées uniques', () => {
  assert.equal(pages.length, 12);
  const titles = new Set();
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path);
    assert.match(html, /<html lang="fr">/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<main id="contenu"/);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), `Titre répété : ${title}`);
    titles.add(title);
  }
});

test('liens internes, images, srcsets, polices et ancres existent', () => {
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    assert.doesNotMatch(html, /href=["']#["']/);
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) refs.push(...match[1].split(',').map((p) => p.trim().split(' ')[0]));
    for (const ref of refs) {
      if (ref.startsWith('#')) assert.ok(html.includes(`id="${ref.slice(1)}"`), `${path}: ${ref}`);
      if (!ref.startsWith('/') || ref.startsWith('//')) continue;
      const clean = ref.split(/[?#]/)[0];
      const target = resolve('dist', '.' + clean, clean.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(target), `${path}: ${ref}`);
      assert.ok(statSync(target).size > 0, `Fichier vide : ${target}`);
    }
    for (const img of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img[0], /alt="[^"]*"/);
      assert.match(img[0], /width="\d+"/);
      assert.match(img[0], /height="\d+"/);
    }
  }
  for (const match of readFileSync('dist/styles/site.css', 'utf8').matchAll(/url\(['"]?(\/[^)'" ]+)/g)) {
    assert.ok(existsSync(resolve('dist', '.' + match[1])), match[1]);
  }
});

test('préparation email encode les saisies sans injection d’en-têtes', () => {
  const result = prepareEmail({ name: 'Élodie & Alex', email: 'e@example.org', profile: 'organisation', organization: 'A&B', message: 'Bonjour ? &bcc=autre@example.org\nMerci !' }, 'contact@example.org');
  const url = new URL(result.href);
  assert.equal(url.protocol, 'mailto:');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('body'), result.body);
  assert.match(result.body, /Organisation : A&B/);
  assert.match(result.subject, /organisation/);
  assert.throws(() => prepareEmail({name:'',email:'bad',message:''}, 'x@y.fr'));
  assert.throws(() => prepareEmail({name:'X',email:'x@y.fr',message:'x'.repeat(2001)}, 'x@y.fr'));
});

test('aucune réservation disponible ni faux envoi ne sont annoncés', () => {
  assert.equal(site.booking.available, false);
  assert.match(readFileSync('dist/rendez-vous/index.html', 'utf8'), /réservation en ligne n’est pas activée/);
  assert.match(readFileSync('dist/contact/index.html', 'utf8'), /Retrouver Christine sur LinkedIn/);
  for (const path of pages) assert.doesNotMatch(readFileSync(path, 'utf8'), /href="(?:mailto:|tel:)"/);
  assert.doesNotMatch(readFileSync('src/scripts/contact.js', 'utf8'), /fetch\(/);
});

test('LinkedIn : sections indépendantes, vides masquées, données échappées', () => {
  assert.equal(linkedinSections(), '');
  linkedinSettings.recommendations = true;
  recommendations.push({author:'Test',role:'',text:'<script>test</script>',source:'https://www.linkedin.com/',visible:true,authorized:false});
  assert.equal(linkedinSections(), '');
  recommendations[0].authorized = true;
  assert.match(linkedinSections(), /&lt;script&gt;/);
  assert.doesNotMatch(linkedinSections(), /<script>/);
  linkedinSettings.recommendations = false;
  linkedinSettings.publications = true;
  assert.equal(linkedinSections(), '');
  publications.push({title:'Test',excerpt:'Texte',date:'2026-10-13',topic:'Travail',url:'https://www.linkedin.com/',visible:true});
  assert.match(linkedinSections(), /Actualités & réflexions/);
  recommendations.length = 0;
  publications.length = 0;
  linkedinSettings.publications = false;
});

test('le build de présentation bloque l’indexation et la publication prématurée', () => {
  assert.match(readFileSync('dist/robots.txt','utf8'), /Disallow: \//);
  for (const path of pages) assert.match(readFileSync(path,'utf8'), /noindex, nofollow/);
  const result = spawnSync(process.execPath, ['scripts/build.mjs','--production'], {encoding:'utf8'});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Publication bloquée/);
});

test('contrastes des textes et boutons : WCAG AA', () => {
  function luminance(hex) {
    const rgb = hex.match(/\w\w/g).map((part) => parseInt(part,16)/255).map((c) => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4);
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  }
  const pairs = [['3a2c24','faf7f2'],['665a4e','f3ebe0'],['555d48','f3ebe0'],['faf7f2','9c482f'],['9c482f','e9dbc9']];
  for (const [fg,bg] of pairs) {
    const l = [luminance(fg),luminance(bg)].sort((a,b)=>b-a);
    assert.ok((l[0]+.05)/(l[1]+.05)>=4.5, `${fg}/${bg}`);
  }
});

test('aucune requête tierce au chargement et JavaScript léger', () => {
  for (const path of pages) {
    const html=readFileSync(path,'utf8');
    assert.doesNotMatch(html, /<(?:script|iframe|img)[^>]+src="https?:/);
    assert.doesNotMatch(html, /<link[^>]+href="https?:[^>]+(?:stylesheet|preconnect)/);
  }
  const bytes = statSync('dist/scripts/main.js').size + statSync('dist/scripts/contact.js').size;
  assert.ok(bytes < 12000, `${bytes} octets de JavaScript`);
});

test('HTTPS, type MIME JavaScript et polices locales garantis au build', () => {
  const apache = readFileSync('dist/.htaccess', 'utf8');
  assert.ok(apache.includes('RewriteCond %{HTTPS} !=on'));
  assert.ok(apache.includes('RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]'));
  assert.ok(apache.includes('AddType text/javascript .js .mjs'));
  assert.ok(apache.includes("font-src 'self'"));
  assert.ok(existsSync('dist/scripts/contact.js'));
  assert.ok(!existsSync('dist/scripts/contact.mjs'));
  assert.match(readFileSync('dist/scripts/main.js', 'utf8'), /from '\.\/contact\.js\?v=[a-f0-9]{16}'/);
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    assert.ok(!html.includes('fonts.googleapis.com'), path);
    assert.ok(!html.includes('fonts.gstatic.com'), path);
  }
  const css = readFileSync('dist/styles/site.css', 'utf8');
  assert.ok(!css.includes('fonts.googleapis.com'));
  assert.ok(!css.includes('fonts.gstatic.com'));
});


test('les pages et le module contact partagent une version calculée sur les assets', async () => {
  const { createHash } = await import('node:crypto');
  const sources = ['src/scripts/main.js', 'src/scripts/contact.js', ...['tokens', 'base', 'components', 'pages', 'responsive'].map(name => `src/styles/${name}.css`)];
  const version = createHash('sha256').update(JSON.stringify(sources.map(path => readFileSync(path, 'utf8')))).digest('hex').slice(0, 16);
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    assert.ok(html.includes(`/scripts/main.js?v=${version}`), path);
    assert.ok(html.includes(`/styles/site.css?v=${version}`), path);
  }
  assert.ok(readFileSync('dist/scripts/main.js', 'utf8').includes(`./contact.js?v=${version}`));
});
