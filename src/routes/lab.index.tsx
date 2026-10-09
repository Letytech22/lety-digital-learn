import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import { labExercises, LAB_COURSE_ID, pageHead } from '@/lib/courses';
import { useLearning } from '@/components/learning-provider';

export const Route = createFileRoute('/lab/')({ head: () => pageHead('Virtual Computer Lab', 'Practise real computer skills like clicking, double-clicking and dragging files, right on your phone.'), component: LabIndex });

function LabIndex() {
  const { progress } = useLearning();
  return (
    <div className="page-width max-w-3xl py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Virtual Computer Lab</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold">A computer inside your phone</h1>
      <p className="mt-4 leading-7 text-muted-foreground">Practise the moves you will use on any computer. Your finger becomes the mouse. Each exercise checks your work and tells you when you are right.</p>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MonitorSmartphone className="size-5 text-primary" />Tip: turn your phone sideways for a bigger desktop.</p>
      <ol className="mt-8 space-y-4">
        {labExercises.map((ex, i) => {
          const done = progress.some(p => p.course_id === LAB_COURSE_ID && p.lesson_id === ex.id && p.step === 5);
          return (
            <li key={ex.id}>
              <Link to="/lab/$exerciseId" params={{ exerciseId: ex.id }} className="flex min-h-20 items-center gap-4 rounded-lg border border-border bg-card p-5 hover:border-primary">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display font-bold text-primary">{done ? <CheckCircle2 className="size-6" /> : i + 1}</span>
                <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">{ex.skill}</span><span className="block font-semibold">{ex.title}</span></span>
                <ArrowRight className="size-5 text-primary" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
