import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { EVENT } from "@/lib/event";

export function SiteFooter() {
  return (
    <footer className="border-t border-sand-200/70 bg-sand-50">
      <div className="container py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <BrandMark className="h-10 w-10" />
            <p className="mt-5 font-display text-2xl leading-snug text-foreground">
              Heaven &amp; Earth
              <span className="block text-base tracking-[0.2em] text-muted-foreground">
                HERMANUS
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Connect
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={EVENT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded text-muted-foreground transition-colors hover:text-sand-700"
                >
                  <Instagram className="size-4" aria-hidden />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={EVENT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded text-muted-foreground transition-colors hover:text-sand-700"
                >
                  <Facebook className="size-4" aria-hidden />
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${EVENT.contactEmail}`}
                  className="inline-flex items-center gap-2.5 rounded text-muted-foreground transition-colors hover:text-sand-700"
                >
                  <Mail className="size-4" aria-hidden />
                  {EVENT.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${EVENT.contactPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 rounded text-muted-foreground transition-colors hover:text-sand-700"
                >
                  <Phone className="size-4" aria-hidden />
                  {EVENT.contactPhone}
                </a>
              </li>
              <li className="pt-1 text-muted-foreground">
                {EVENT.venueFull}
                <br />
                {EVENT.venueAddress}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sand-200/80 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {EVENT.host}. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="rounded transition-colors hover:text-sand-700"
          >
            Organiser login
          </Link>
        </div>
      </div>
    </footer>
  );
}
