import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event";

/** How long a checkout may hold seats before they return to the pool. */
export const HOLD_MINUTES = 20;

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Seats that are unavailable right now: every paid booking, plus pending
 * bookings whose hold has not yet expired. Expired holds are treated as free
 * immediately, so an abandoned checkout never permanently costs a seat.
 */
export async function countSeatsTaken(db: Db = prisma): Promise<number> {
  const now = new Date();
  const result = await db.booking.aggregate({
    _sum: { quantity: true },
    where: {
      OR: [
        { status: "PAID" },
        { status: "PENDING", holdExpiresAt: { gt: now } },
      ],
    },
  });
  return result._sum.quantity ?? 0;
}

export type Availability = {
  capacity: number;
  sold: number;
  remaining: number;
  soldOut: boolean;
};

/**
 * Public-facing availability. Deliberately counts only PAID bookings as
 * "sold" so the number on the page does not flicker as people open and
 * abandon checkouts, but clamps `remaining` to what can actually be bought.
 */
export async function getAvailability(db: Db = prisma): Promise<Availability> {
  const [paid, taken] = await Promise.all([
    db.booking.aggregate({
      _sum: { quantity: true },
      where: { status: "PAID" },
    }),
    countSeatsTaken(db),
  ]);

  const sold = paid._sum.quantity ?? 0;
  const remaining = Math.max(0, EVENT.capacity - taken);

  return {
    capacity: EVENT.capacity,
    sold,
    remaining,
    soldOut: remaining <= 0,
  };
}

export class SoldOutError extends Error {
  constructor(public remaining: number) {
    super(
      remaining <= 0
        ? "This event is fully booked."
        : `Only ${remaining} ticket${remaining === 1 ? "" : "s"} left.`,
    );
    this.name = "SoldOutError";
  }
}

/**
 * Atomically reserves `quantity` seats and returns the created PENDING
 * booking. Runs at SERIALIZABLE isolation so two concurrent checkouts can
 * never both read the same remaining count and both succeed — Postgres
 * aborts the loser, which we surface as a retry.
 *
 * This is the only path that may create a booking.
 */
export async function reserveSeats(input: {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  quantity: number;
  totalAmount: number;
}) {
  const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60_000);

  return prisma.$transaction(
    async (tx) => {
      const taken = await countSeatsTaken(tx);
      const remaining = EVENT.capacity - taken;

      if (input.quantity > remaining) {
        throw new SoldOutError(Math.max(0, remaining));
      }

      return tx.booking.create({
        data: { ...input, holdExpiresAt, status: "PENDING" },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
