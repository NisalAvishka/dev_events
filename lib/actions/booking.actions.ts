"use server";
import { Booking } from "@/database";
import connectToDatabase from "@/lib/mongodb";


export const createBooking = async ({
  email,
  slug,
  eventId,
}: {
  email: string;
  slug: string;
  eventId: string;
}) => {
  try {
    await connectToDatabase();
    await Booking.create({
        eventId, email, slug
    });

    return ({
        success: true
    });
  } catch (e) {
    console.error("create booking failed", e);
    return {
      success: false,
    };
  }
};
