const escape = (text: string) => text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
// Accetta solo link relativi, http(s), mailto e tel: niente `javascript:` dal CMS.
const safeUrl = (url = '') => (/^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : '#');

const nodeText = (node: any): string => node.children ? node.children.map(nodeText).join(node.type === 'list' ? '\n' : '') : node.text ?? '';
export const blocksToText = (blocks: any[] = []) => blocks.map(nodeText).join('\n');

function inline(nodes: any[] = []): string {
  return nodes.map((node) => {
    if (node.type === 'link') return `<a href="${escape(safeUrl(node.url))}">${inline(node.children)}</a>`;
    let html = escape(node.text ?? '');
    if (node.code) html = `<code>${html}</code>`;
    if (node.bold) html = `<strong>${html}</strong>`;
    if (node.italic) html = `<em>${html}</em>`;
    if (node.underline) html = `<u>${html}</u>`;
    if (node.strikethrough) html = `<s>${html}</s>`;
    return html;
  }).join('');
}

export function blockToHtml(block: any, headingShift = 0): string {
  switch (block.type) {
    case 'heading': {
      const level = Math.min(6, block.level - headingShift);
      return `<h${level}>${inline(block.children)}</h${level}>`;
    }
    case 'list': {
      const tag = block.format === 'ordered' ? 'ol' : 'ul';
      const items = block.children.map((item: any) => item.type === 'list' ? blockToHtml(item, headingShift) : `<li>${inline(item.children)}</li>`);
      return `<${tag}>${items.join('')}</${tag}>`;
    }
    case 'quote': return `<blockquote>${inline(block.children)}</blockquote>`;
    case 'code': return `<pre><code>${escape(blocksToText(block.children))}</code></pre>`;
    case 'image': return `<img src="${escape(safeUrl(block.image?.url))}" alt="${escape(block.image?.alternativeText ?? '')}" width="${block.image?.width}" height="${block.image?.height}" loading="lazy" />`;
    default: return `<p>${inline(block.children)}</p>`;
  }
}

export const blocksToHtml = (blocks: any[] = []) => blocks.map((block) => blockToHtml(block)).join('');
