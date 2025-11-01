import mongoose, { Schema, Document, Model } from "mongoose";
import Event from "./event.model";

/**
 * TypeScript interface for Booking document
 * Extends mongoose Document to include all schema fields
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 * Links bookings to events with proper validation
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string): boolean {
          // RFC 5322 compliant email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate event existence
 * Ensures that bookings reference valid events
 */
BookingSchema.pre("save", async function (next) {
  // Only validate eventId if it's new or has been modified
  if (this.isNew || this.isModified("eventId")) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        return next(
          new Error(
            "Event not found. Cannot create booking for non-existent event."
          )
        );
      }
    } catch {
      return next(new Error("Error validating event reference"));
    }
  }

  next();
});

// Create index on eventId for faster lookups and queries
BookingSchema.index({ eventId: 1 });

// Compound index for common queries (event + email)
BookingSchema.index({ eventId: 1, email: 1 });

/**
 * Export Booking model
 * Uses existing model if already compiled (prevents OverwriteModelError in development)
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
