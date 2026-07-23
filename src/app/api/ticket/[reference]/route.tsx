import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { EVENT, formatZAR } from "@/lib/event";
import { getAppUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const C = {
  cream: "#FBF7F4",
  paper: "#FFFFFF",
  rose: "#C08D83",
  roseDeep: "#A9635A",
  ink: "#3E322F",
  muted: "#8A7168",
  line: "#EDDCD6",
  gold: "#C2A177",
};

/** Fonts are bundled rather than fetched so rendering never depends on a
 *  third-party host being up. Loaded once per lambda. */
let fontCache: Record<string, Buffer> | null = null;

async function fonts() {
  if (fontCache) return fontCache;
  const dir = path.join(process.cwd(), "src/assets/fonts");
  const [c300, c600, i400, i600] = await Promise.all([
    readFile(path.join(dir, "cormorant-300.ttf")),
    readFile(path.join(dir, "cormorant-600.ttf")),
    readFile(path.join(dir, "inter-400.ttf")),
    readFile(path.join(dir, "inter-600.ttf")),
  ]);
  fontCache = { c300, c600, i400, i600 };
  return fontCache;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    select: {
      reference: true,
      firstName: true,
      lastName: true,
      quantity: true,
      totalAmount: true,
      status: true,
    },
  });

  if (!booking || booking.status !== "PAID") {
    return new Response("Ticket not found", { status: 404 });
  }

  const f = await fonts();

  // QR resolves to the confirmation page, so door staff can verify a ticket
  // against live data rather than trusting the image.
  const qr = await QRCode.toDataURL(
    `${getAppUrl()}/booking/success?ref=${encodeURIComponent(booking.reference)}`,
    { margin: 0, width: 260, color: { dark: C.ink, light: "#FFFFFF" } },
  );

  const guest = `${booking.firstName} ${booking.lastName}`.trim();
  const tickets = `${booking.quantity} ${booking.quantity === 1 ? "Ticket" : "Tickets"}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1350px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.cream,
          padding: "56px",
          fontFamily: "Inter",
        }}
      >
        {/* Ticket body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: C.paper,
            border: `2px solid ${C.line}`,
          }}
        >
          {/* Header band */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: C.rose,
              padding: "44px 40px 40px",
            }}
          >
            <div
              style={{
                fontSize: 30,
                letterSpacing: 14,
                color: "#FFFFFF",
                fontFamily: "Cormorant",
                fontWeight: 600,
              }}
            >
              {"H&E"}
            </div>
            <div
              style={{
                fontSize: 17,
                letterSpacing: 7,
                color: "rgba(255,255,255,0.88)",
                marginTop: 14,
              }}
            >
              {"HEAVEN & EARTH HERMANUS"}
            </div>
          </div>

          {/* Event title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "44px 60px 0",
            }}
          >
            <div
              style={{
                fontSize: 19,
                letterSpacing: 8,
                color: C.muted,
              }}
            >
              {`ADMIT ${booking.quantity}`}
            </div>
            <div
              style={{
                fontSize: 74,
                lineHeight: 1.05,
                color: C.ink,
                fontFamily: "Cormorant",
                fontWeight: 300,
                marginTop: 18,
                textAlign: "center",
              }}
            >
              {"Women’s Day"}
            </div>
            <div
              style={{
                fontSize: 74,
                lineHeight: 1.05,
                color: C.ink,
                fontFamily: "Cormorant",
                fontWeight: 300,
                textAlign: "center",
              }}
            >
              Movie Night
            </div>

            <div
              style={{
                width: 90,
                height: 2,
                backgroundColor: C.rose,
                marginTop: 28,
              }}
            />
          </div>

          {/* Guest */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 28,
            }}
          >
            <div style={{ fontSize: 17, letterSpacing: 6, color: C.muted }}>
              GUEST
            </div>
            <div
              style={{
                fontSize: 50,
                color: C.ink,
                fontFamily: "Cormorant",
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              {guest}
            </div>
          </div>

          {/* Detail grid */}
          <div
            style={{
              display: "flex",
              marginTop: 46,
              paddingLeft: 60,
              paddingRight: 60,
            }}
          >
            {[
              { label: "DATE", value: "Sun, 9 Aug" },
              { label: "WORSHIP", value: "5:00 PM" },
              { label: "MOVIE", value: "6:00 PM" },
            ].map((d) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 15, letterSpacing: 5, color: C.muted }}>
                  {d.label}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    color: C.ink,
                    fontFamily: "Cormorant",
                    fontWeight: 600,
                    marginTop: 8,
                  }}
                >
                  {d.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <div style={{ fontSize: 15, letterSpacing: 5, color: C.muted }}>
              VENUE
            </div>
            <div
              style={{
                fontSize: 38,
                color: C.ink,
                fontFamily: "Cormorant",
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              {EVENT.venueFull}
            </div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 8 }}>
              Hemel en Aarde Valley, Hermanus
            </div>
          </div>

          {/* Perforation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 46,
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            {Array.from({ length: 34 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: C.line,
                  marginRight: 12,
                }}
              />
            ))}
          </div>

          {/* Stub: reference + QR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "34px 60px 34px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 15, letterSpacing: 5, color: C.muted }}>
                BOOKING REFERENCE
              </div>
              <div
                style={{
                  fontSize: 46,
                  color: C.roseDeep,
                  fontWeight: 600,
                  letterSpacing: 3,
                  marginTop: 12,
                }}
              >
                {booking.reference}
              </div>
              <div style={{ fontSize: 21, color: C.muted, marginTop: 12 }}>
                {`${tickets} · ${formatZAR(booking.totalAmount)} paid`}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                padding: 10,
                border: `2px solid ${C.line}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} width={132} height={132} alt="" />
            </div>
          </div>

          {/* Bring reminder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "auto",
              backgroundColor: "#FBF3F0",
              padding: "26px 60px",
            }}
          >
            <div style={{ fontSize: 15, letterSpacing: 5, color: C.muted }}>
              PLEASE BRING
            </div>
            <div
              style={{
                fontSize: 27,
                color: C.ink,
                fontFamily: "Cormorant",
                fontWeight: 600,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {"Pillow · Blanket · Warm clothes · Snacks & drinks · Notebook"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            color: C.muted,
            marginTop: 26,
          }}
        >
          {`Show this ticket at the door · Questions? WhatsApp ${EVENT.contactName} on ${EVENT.contactPhone}`}
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Cormorant", data: f.c300, weight: 300, style: "normal" },
        { name: "Cormorant", data: f.c600, weight: 600, style: "normal" },
        { name: "Inter", data: f.i400, weight: 400, style: "normal" },
        { name: "Inter", data: f.i600, weight: 600, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
