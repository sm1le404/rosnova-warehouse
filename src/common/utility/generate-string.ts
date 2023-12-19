export interface GenerateOptions {
  length?: number;
  charsets?: Charset[];
  customCharset?: string;
}
export enum Charset {
  Numeric = 'numeric',
  AlphaLower = 'alphabet_lower',
  AlphaUpper = 'alphabet_upper',
  Specials = 'specials',
}

export const Charsets: Record<Charset, string> = {
  [Charset.Numeric]: '0123456789',
  [Charset.AlphaLower]: 'abcdefghijklmnopqrstuvwxyz',
  [Charset.AlphaUpper]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  [Charset.Specials]: `!"#$%&'()*+-/_:;<=>?@[]^{}~`,
};

export const generate = (options?: GenerateOptions): string => {
  const chars =
    [
      options?.charsets.map((name) => Charsets[name]).join('') ?? '',
      options?.customCharset ?? '',
    ].join('') || Charsets.numeric;

  let code: string = '';
  for (let i = options?.length ?? 4; i > 0; i--) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};
