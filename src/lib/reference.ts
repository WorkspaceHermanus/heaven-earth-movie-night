import crypto from "crypto";

/** Crockford-style alphabet: no 0/O/1/I/L, so references are safe to read aloud. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Generates a booking reference such as `HE-7K4QT2`. */
export function generateReference(): string {
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `HE-${out}`;
}
