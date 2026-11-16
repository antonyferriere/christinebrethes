import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { homePage } from '../src/pages/home.mjs';

test('L’image précède le texte de présentation dans le DOM mobile', () => {
  const html = homePage();
  const section = html.match(/<section class="section container introduction">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'La section de présentation doit exister');
  assert.ok(section.indexOf('class="introduction-image"') < section.indexOf('Faisons connaissance'));
  assert.match(section, /Mon parcours & mes valeurs/);
});

test('Une seule colonne sous 840px et image à droite sur deux colonnes', () => {
  const css = readFileSync('src/styles/responsive.css', 'utf8');
  const base = readFileSync('src/styles/pages.css', 'utf8');
  assert.match(css, /@media \(max-width: 839px\) \{[\s\S]*?\.home \.introduction \{ grid-template-columns: minmax\(0, 1fr\); \}/);
  assert.match(css, /@media \(min-width: 840px\) \{[\s\S]*?\.home \.introduction > \.introduction-image \{ grid-column: 2; grid-row: 1; \}/);
  assert.match(css, /\.home \.introduction > div:last-child \{ grid-column: 1; grid-row: 1; \}/);
  assert.match(base, /\.home \.introduction-image \{ aspect-ratio: 4 \/ 3; \}/);
});
