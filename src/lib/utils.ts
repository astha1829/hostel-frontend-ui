/**
 * Combines multiple CSS class names into a single space-separated string, filtering out falsy values.
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

/**
 * Format phone numbers into standard readable form (e.g. +X (XXX) XXX-XXXX or XXX-XXX-XXXX)
 */
export function formatPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return "-";
  const cleaned = ("" + phone).replace(/\D/g, "");
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Format string as Title Case (e.g. ACTIVE -> Active)
 */
export function capitalize(str: string | undefined | null): string {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
