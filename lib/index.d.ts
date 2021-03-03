export interface Context {
  isValid: () => boolean;
  errors: () => undefined | {[key: string]: unknown};
}

export interface Valida {
  Sanitizer: {[name: string]: string};
  Validator: {[name: string]: string};
  process: (obj: unknown, schema: {[key: string]: {
    sanitizer?: string | function,
    validator?: string | function,
    groups?: string[],
    [key: string]: unknown,
  }[]}, cb: (err: Error, ctx: Context) => void, groups?: string[]) => void;
}
