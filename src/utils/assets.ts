/** Ghép đường dẫn file trong public/ với base của site (cần cho GitHub Pages: /wedding-invitation/). */
export function withBase(path: string): string {
  return path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}
