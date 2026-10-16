// Applied at build time to the complete page, including header and footer.
export function externalLinks(html, siteUrl) {
  const origin = new URL(siteUrl).origin;
  return html.replace(/<a\b[^>]*>/gi, tag => {
    const href = tag.match(/\shref\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!href) return tag;
    let url;
    try { url = new URL(href, siteUrl); } catch { return tag; }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin === origin) return tag;
    const rel = tag.match(/\srel\s*=\s*(["'])(.*?)\1/i)?.[2] || '';
    const relations = new Set([...rel.toLowerCase().split(/\s+/).filter(Boolean), 'noopener', 'noreferrer']);
    relations.delete('opener');
    return tag.replace(/\s(?:target|rel)\s*=\s*(["']).*?\1/gi, '').replace(/>$/, ` target="_blank" rel="${[...relations].join(' ')}">`);
  });
}
