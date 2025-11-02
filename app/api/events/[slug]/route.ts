import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

//GET /api/events/[slug]
 
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Extract slug from route parameters
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Slug parameter is required and must be a valid string" },
        { status: 400 }
      );
    }

    // Sanitize and validate slug format
    const sanitizedSlug = slug.trim().toLowerCase();

    if (sanitizedSlug.length === 0) {
      return NextResponse.json(
        { message: "Slug cannot be empty" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        message: "Event retrieved successfully",
        event,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching event by slug:", e);

    // Handle Mongoose/MongoDB specific errors
    if (e instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { message: "Invalid slug format for database query" },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Failed to retrieve event",
        error: e instanceof Error ? e.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
