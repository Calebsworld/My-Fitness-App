export function convertBase64StringtoUrl(base64String: string): string {
  return `data:image/jpeg;base64,${base64String}`;
}