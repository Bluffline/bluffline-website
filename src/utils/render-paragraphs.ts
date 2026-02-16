/**
 * Splits a multi-paragraph text field (separated by double newlines)
 * into individual <p> tags for rendering.
 */
export function renderParagraphs(text: string | undefined): string {
  if (!text) return '';
  return text
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('\n');
}
