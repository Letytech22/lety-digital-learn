import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/courses';
import { FAQList } from '@/components/home-page';
export const Route=createFileRoute('/faq')({head:()=>pageHead('Frequently Asked Questions','Answers about learning on your phone, saved progress and beginner digital skills at Lety Digital Academy.'),component:FAQPage});
function FAQPage(){return <div className="page-width max-w-3xl py-14"><p className="text-xs font-bold uppercase tracking-widest text-primary">A little clarity</p><h1 className="mb-4 mt-3 font-display text-4xl font-extrabold">Your questions, answered.</h1><p className="mb-10 text-muted-foreground">Everything you need to take your first step.</p><FAQList/></div>}