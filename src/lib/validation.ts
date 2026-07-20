import { z } from "zod";
import { EVENT } from "@/lib/event";

/**
 * Accepts the shapes South Africans actually type: 082 123 4567,
 * +27 82 123 4567, 0821234567, with or without spaces, dashes or brackets.
 */
const phoneRegex = /^(\+?\d[\d\s()-]{7,17}\d)$/;

export const bookingSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Please enter your first name.")
    .max(60, "That name is a little too long."),
  lastName: z
    .string()
    .trim()
    .min(2, "Please enter your last name.")
    .max(60, "That name is a little too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(180),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .max(20),
  quantity: z.coerce
    .number()
    .int("Please choose a whole number of tickets.")
    .min(EVENT.minTickets, `Minimum ${EVENT.minTickets} ticket.`)
    .max(EVENT.maxTickets, `Maximum ${EVENT.maxTickets} tickets per booking.`),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Please enter the admin password."),
});
