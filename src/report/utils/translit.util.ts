import CyrillicToTranslit from 'cyrillic-to-translit-js';

export const translitFromRuToEn = (
  text: string,
  spaceReplacement = '_',
): string => {
  return CyrillicToTranslit().transform(text, spaceReplacement);
};
