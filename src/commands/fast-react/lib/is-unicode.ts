export function isUnicode(char: string): boolean {
  return char.charCodeAt(0) > 127;
}
