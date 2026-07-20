import crypto from "crypto";

const YOCO_API_URL = "https://payments.yoco.com/api";

export function getYocoSecretKey() {
  return process.env.YOCO_SECRET_KEY || "";
}

export function getYocoWebhookSecret() {
  return process.env.YOCO_WEBHOOK_SECRET || "";
}

export function isYocoConfigured() {
  return Boolean(getYocoSecretKey());
}

export type YocoCheckout = {
  id: string;
  redirectUrl: string;
  status: string;
};

/**
 * Creates a Yoco hosted checkout. The idempotency key is our booking
 * reference, so a retried request returns the same checkout instead of
 * charging twice.
 */
export async function createYocoCheckout(
  payload: Record<string, unknown>,
  idempotencyKey: string,
): Promise<YocoCheckout> {
  const secretKey = getYocoSecretKey();
  if (!secretKey) throw new Error("YOCO_SECRET_KEY is not configured");

  const response = await fetch(`${YOCO_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.reason || "Failed to create Yoco checkout",
    );
  }

  return data as YocoCheckout;
}

/**
 * Verifies a Yoco webhook using the Standard Webhooks scheme:
 * HMAC-SHA256 over `{id}.{timestamp}.{body}` keyed by the base64 portion of
 * the signing secret. Rejects deliveries older than three minutes to blunt
 * replay attempts.
 */
export function verifyYocoWebhookSignature(
  headers: Headers,
  rawBody: string,
): boolean {
  const webhookSecret = getYocoWebhookSecret();
  const webhookId = headers.get("webhook-id");
  const webhookTimestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");

  if (!webhookSecret || !webhookId || !webhookTimestamp || !signatureHeader) {
    return false;
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(webhookTimestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 180) return false;

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const secretBytes = Buffer.from(webhookSecret.split("_")[1] ?? "", "base64");
  if (secretBytes.length === 0) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  const signatures = signatureHeader
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(",")[1])
    .filter(Boolean);

  return signatures.some((signature) => {
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    return (
      provided.length === expected.length &&
      crypto.timingSafeEqual(provided, expected)
    );
  });
}
