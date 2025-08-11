// Utility functions for the CLIPcherry Worker

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Generate a random alphanumeric string */
export function generateRandomString(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Get the current timestamp in ISO format */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/** Derive a Bitcoin address from an XPUB and index.
 * In production you would use a library like bitcoinjs-lib to derive addresses.
 * This placeholder returns a deterministic string for demonstration.
 */
export function deriveBTCAddress(xpub: string, index: number): string {
  return `${xpub}-addr-${index}`;
}

/** Generate an XRP destination tag for an order.  */
export function generateXRPDestinationTag(orderId: number): number {
  // Simply reuse the order ID. In production ensure it fits within the 32-bit tag range.
  return orderId;
}
