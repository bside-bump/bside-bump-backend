export const REGEX_ENGLISH = new RegExp(/^[a-zA-Z0-9\s]+$/);
export const REGEX_KOREAN = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]+$/;

export function parseLanguage(text: string): string {
  if (REGEX_ENGLISH.test(text)) {
    return 'en';
  } else if (REGEX_KOREAN.test(text)) {
    return 'ko';
  }
  return 'ko';
}
