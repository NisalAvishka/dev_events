"use server";

import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";
import { unstable_cache } from "next/cache";

export const getSimilarEvents = unstable_cache(
  async (slug: string) => {
    try {
      await connectToDatabase();

      const event = await Event.findOne({ slug });

      return await Event.find({
        _id: { $ne: event?._id },
        tags: { $in: event?.tags || [] },
      }).lean();
    } catch {
      return [];
    }
  },
  ["similar-events"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["events"],
  }
);
