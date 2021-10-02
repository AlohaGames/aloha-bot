export function isCustomEmoji(customEmoji: string): boolean {
  return customEmoji.startsWith("<:");
}

export function getCustomEmojiId(customEmoji: string): string {
  const emoSplit = customEmoji.split(":");
  return emoSplit[emoSplit.length - 1].slice(0, -1);
}
