type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: boolean | undefined | null };

/**
 * Minimal classNames utility — joins truthy values, supports array / object
 * inputs. Mirrors the `clsx` API subset we actually use.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const push = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (typeof value === 'object') {
      for (const key in value) {
        if (value[key]) out.push(key);
      }
    }
  };

  inputs.forEach(push);
  return out.join(' ');
}
