export function decodeHTMLEntities(text: string): string {
    return text.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
    });
}

export function sanitizeHtml(text: string): string {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}
