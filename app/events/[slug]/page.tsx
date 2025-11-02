import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <span>{label}</span>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

export async function generateStaticParams() {

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [{ slug: "placeholder" }];
    }

    const data = await response.json();
    const events = data.events || [];

    if (events.length === 0) {
      return [{ slug: "placeholder" }];
    }

    return events.map((event: { slug: string }) => ({
      slug: event.slug,
    }));
  } catch {
    return [{ slug: "placeholder" }];
  }
}

const EventsDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!request.ok) return notFound();

  const {
    event: {
      _id,
      description,
      image,
      location,
      date,
      time,
      overview,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = await request.json();

  if (!description) return notFound();

  const bookings = 10;

  const similarEvents = await getSimilarEvents(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* Left side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Image"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="Clock" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="Location"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="Audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Right side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p> Join {bookings} people who have already booked their spot!</p>
            ) : (
              <p>Be the first to book your spot!</p>
            )}
            <BookEvent eventId={_id} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent) => (
              <EventCard key={similarEvent._id.toString()} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventsDetailsPage;
