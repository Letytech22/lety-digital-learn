import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { labExercises, LAB_COURSE_ID, pageHead } from '@/lib/courses';
import { useLearning } from '@/components/learning-provider';
import { VirtualDesktop } from '@/components/virtual-desktop';

export const Route = createFileRoute('/lab/$exerciseId')({
  head: ({ params }) => { const ex = labExercises.find(e => e.id === params.exerciseId); return pageHead(ex ? `Lab: ${ex.title}` : 'Lab exercise not found', ex ? `${ex.task} Practise it in the Lety Virtual Computer Lab.` : 'Practise computer skills in the Lety Virtual Computer Lab.'); },
  component: ExercisePage,
});

function ExercisePage() {
  const { exerciseId } = Route.useParams();
  const ex = labExercises.find(e => e.id === exerciseId);
  if (!ex) return <div className="page-width py-16">Exercise not found. <Link to="/lab" className="text-primary">Back to the lab</Link></div>;
  return <Exercise key={ex.id} exercise={ex} />;
}

function Exercise({ exercise }: { exercise: (typeof labExercises)[number] }) {
  const { user, progress, completeStep } = useLearning();
  const [mode, setMode] = useState<'guided' | 'independent'>('guided');
  const [showMe, setShowMe] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const index = labExercises.findIndex(e => e.id === exercise.id);
  const next = labExercises[index + 1];
  const saved = progress.some(p => p.course_id === LAB_COURSE_ID && p.lesson_id === exercise.id && p.step === 5);

  async function complete() { setDone(true); setShowMe(false); if (user) await completeStep(LAB_COURSE_ID, exercise.id, 5); }
  function reset() { setDone(false); setFeedback(''); setShowMe(false); setRound(r => r + 1); }

  return (
    <div className="bg-muted"><div className="page-width max-w-4xl py-8">
      <Link to="/lab" className="inline-flex min-h-10 items-center gap-2 text-xs text-muted-foreground"><ArrowLeft className="size-4" />Virtual Computer Lab</Link>
      <p className="mt-4 text-xs text-primary">Exercise {index + 1} of {labExercises.length} · {exercise.skill}{saved ? ' · Completed' : ''}</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{exercise.title}</h1>
      <div className="mt-5 inline-flex rounded-lg border border-border bg-card p-1" role="group" aria-label="Practice mode">
        {(['guided', 'independent'] as const).map(m => <Button key={m} size="sm" variant={mode === m ? 'default' : 'ghost'} onClick={() => setMode(m)} aria-pressed={mode === m}>{m === 'guided' ? 'Guided practice' : 'Independent practice'}</Button>)}
      </div>
      <section className="mt-5 rounded-lg border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your task</p>
        <p className="mt-2 font-semibold">{exercise.task}</p>
        {mode === 'guided' && <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">{exercise.guided.map(s => <li key={s}>{s}</li>)}</ol>}
      </section>
      <div className="mt-5"><VirtualDesktop key={round} exercise={exercise} showMe={showMe} completed={done} onFeedback={setFeedback} onComplete={() => void complete()} /></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className={`min-h-6 text-sm ${feedback.startsWith('Correct') ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>{feedback || 'Use your finger like a mouse on the desktop above.'}</p>
        <div className="flex gap-2">
          {!done && <Button variant="outline" onClick={() => setShowMe(s => !s)}><Eye />{showMe ? 'Hide hint' : 'Show me'}</Button>}
          <Button variant="ghost" onClick={reset}><RotateCcw />Start again</Button>
        </div>
      </div>
      {done && (
        <section className="mt-6 rounded-lg border border-primary bg-card p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-primary" />
          <h2 className="mt-3 font-display text-xl font-bold">Correct! Well done.</h2>
          <p className="mt-2 text-sm text-muted-foreground">{exercise.success}</p>
          <p className="mt-2 text-xs text-muted-foreground">{user ? 'Your progress is saved.' : <>Practice is free. <Link to="/auth" className="text-primary">Sign in</Link> to save your progress.</>}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {next ? <Button asChild><Link to="/lab/$exerciseId" params={{ exerciseId: next.id }}>Next exercise<ArrowRight /></Link></Button> : <Button asChild><Link to="/lab">Back to the lab<ArrowRight /></Link></Button>}
            {mode === 'guided' && <Button variant="outline" onClick={() => { setMode('independent'); reset(); }}>Try it without help</Button>}
          </div>
        </section>
      )}
    </div></div>
  );
}
