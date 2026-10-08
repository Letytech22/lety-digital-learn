import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/home-page';
import { pageHead } from '@/lib/courses';
export const Route = createFileRoute("/")({
  head: () => pageHead('Learn Computer Skills, Even Without a Computer', 'Learn Digital Skills. Practice Anywhere. Beginner-friendly, mobile-first digital learning by Lety Tech Consultancy.'),
  component: HomePage,
});
