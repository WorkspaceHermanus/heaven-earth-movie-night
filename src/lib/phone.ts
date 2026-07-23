/**
 * Normalises the phone shapes South Africans actually type into E.164
 * digits (no leading `+`), which is what WhatsApp and wa.me links expect.
 *
 *   082 123 4567      → 27821234567
 *   0821234567        → 27821234567
 *   +27 82 123 4567   → 27821234567
 *   27821234567       → 27821234567
 *   (082) 123-4567    → 27821234567
 *
 * Returns null when the input cannot be resolved to a plausible number,
 * so callers can skip sending rather than fire at a bad address.
 */
export function toE164(raw: string, defaultCountry = "27"): string | null {
  if (!raw) return null;

  const hadPlus = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  // 00 international prefix is equivalent to a leading +.
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (!hadPlus && digits.startsWith("0")) {
    // Local trunk form: drop the 0 and prepend the country code.
    digits = defaultCountry + digits.slice(1);
  }

  // Bare local number without the trunk 0 (e.g. "821234567").
  if (digits.length === 9 && !digits.startsWith(defaultCountry)) {
    digits = defaultCountry + digits;
  }

  // E.164 allows at most 15 digits; anything under 8 is not a real number.
  if (digits.length < 8 || digits.length > 15) return null;

  return digits;
}

/** Pretty form for display, e.g. `+27 82 123 4567`. */
export function formatPhoneDisplay(raw: string): string {
  const e164 = toE164(raw);
  if (!e164) return raw;
  if (e164.startsWith("27") && e164.length === 11) {
    return `+27 ${e164.slice(2, 4)} ${e164.slice(4, 7)} ${e164.slice(7)}`;
  }
  return `+${e164}`;
}

/** Click-to-chat link that opens WhatsApp with `text` pre-filled. */
export function waLink(phone: string | null, text: string): string {
  const e164 = phone ? toE164(phone) : null;
  const encoded = encodeURIComponent(text);
  return e164
    ? `https://wa.me/${e164}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
