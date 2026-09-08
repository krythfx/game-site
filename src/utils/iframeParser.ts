/**
 * Utility to parse and handle iframe strings from games.json
 */
export function extractIframeSrc(iframeHtml: string): string {
  if (!iframeHtml) return '';
  
  // If it's already a plain URL
  if (iframeHtml.startsWith('http://') || iframeHtml.startsWith('https://') || iframeHtml.startsWith('/')) {
    return iframeHtml.trim();
  }

  // Regex to extract src from <iframe src="...">
  const srcMatch = iframeHtml.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }

  return '';
}

/**
 * Normalizes or creates an iframe tag string from a game URL
 */
export function createIframeString(url: string, title: string): string {
  const cleanUrl = url.trim();
  const cleanTitle = title.replace(/"/g, '&quot;');
  return `<iframe src="${cleanUrl}" title="${cleanTitle}" width="100%" height="100%" frameborder="0" allow="fullscreen; autoplay" allowfullscreen="true" loading="lazy"></iframe>`;
}
