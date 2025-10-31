export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 14-15, 2025",
    time: "9:00 AM - 6:00 PM CEST",
  },
  {
    title: "Next.js Conf",
    image: "/images/event2.png",
    slug: "nextjs-conf-2025",
    location: "San Francisco, CA",
    date: "October 25-26, 2025",
    time: "10:00 AM - 5:00 PM PST",
  },
  {
    title: "DevOps World Conference",
    image: "/images/event3.png",
    slug: "devops-world-2025",
    location: "Austin, TX",
    date: "September 8-10, 2025",
    time: "8:30 AM - 7:00 PM CST",
  },
  {
    title: "AI & Machine Learning Summit",
    image: "/images/event4.png",
    slug: "ai-ml-summit-2025",
    location: "London, UK",
    date: "November 12-14, 2025",
    time: "9:00 AM - 6:30 PM GMT",
  },
  {
    title: "Global Hackathon Weekend",
    image: "/images/event5.png",
    slug: "global-hackathon-2025",
    location: "Virtual & 50+ Cities",
    date: "December 5-7, 2025",
    time: "48 Hours Non-stop",
  },
  {
    title: "JavaScript Conference",
    image: "/images/event6.png",
    slug: "js-conf-2025",
    location: "Berlin, Germany",
    date: "May 20-22, 2025",
    time: "9:30 AM - 6:00 PM CEST",
  },
];
