import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";

const EventsDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slugs = params.then((p) => ({ slug: p.slug }));

  return (
    <main>
      <Suspense fallback={<div>Loading event details...</div>}>
        <EventDetails slugs={slugs} />
      </Suspense>
    </main>
  );
};

export default EventsDetailsPage;
