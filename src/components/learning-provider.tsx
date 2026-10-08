import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { courses, lessonsFor } from '@/lib/courses';
import { toast } from 'sonner';
type Progress = { course_id: string; lesson_id: string; step: number; updated_at: string };
type LearningState = { user: User | null; name: string; loading: boolean; progress: Progress[]; saving: boolean; completeStep: (courseId:string,lessonId:string,step:number)=>Promise<boolean>; saveName:(name:string)=>Promise<void>; signOut:()=>Promise<void>; percentage:(id:string)=>number };
const LearningContext = createContext<LearningState | null>(null);
export function LearningProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null); const [name,setName]=useState('Learner'); const [loading,setLoading]=useState(true); const [progress,setProgress]=useState<Progress[]>([]); const [saving,setSaving]=useState(false);
 useEffect(()=>{
  let active=true; let identity:string|undefined;
  async function load(next:User|null) {
   identity=next?.id; setUser(next); setProgress([]); setLoading(true);
   if (!next) {setName('Learner'); setLoading(false); return;}
   const id=next.id;
   const [profile,rows]=await Promise.all([supabase.from('profiles').select('display_name').eq('id',id).maybeSingle(),supabase.from('learning_progress').select('course_id,lesson_id,step,updated_at').eq('user_id',id)]);
   if (!active || identity!==id) return;
   if(profile.error || rows.error) toast.error('Your progress could not be loaded. Please refresh to try again.');
   setName(profile.data?.display_name ?? next.user_metadata?.display_name ?? 'Learner'); setProgress(rows.data ?? []); setLoading(false);
  }
  supabase.auth.getUser().then(({data})=>{if(active) void load(data.user)});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED') setTimeout(()=>{if(active) void load(session?.user??null)},0)});
  return ()=>{active=false;subscription.unsubscribe()};
 },[]);
 async function completeStep(courseId:string,lessonId:string,step:number) {
  if(!user){toast.error('Sign in to save your progress.');return false;} setSaving(true);
  const current=progress.find(p=>p.course_id===courseId&&p.lesson_id===lessonId); const row={user_id:user.id,course_id:courseId,lesson_id:lessonId,step:Math.max(step,current?.step??0),updated_at:new Date().toISOString()};
  const {error}=await supabase.from('learning_progress').upsert(row);
  setSaving(false); if(error){toast.error('Progress could not be saved. Please try again.');return false;}
  setProgress(prev=>[...prev.filter(p=>p.course_id!==courseId||p.lesson_id!==lessonId),row]);return true;
 }
 async function saveName(value:string){if(!user)return;const clean=value.trim();if(!clean){toast.error('Please enter your name.');return;}setSaving(true);const {error}=await supabase.from('profiles').upsert({id:user.id,display_name:clean});setSaving(false);if(error){toast.error('Your name could not be saved.');return;}setName(clean);toast.success('Profile saved.');}
 async function signOut(){setProgress([]);setUser(null);setName('Learner');const {error}=await supabase.auth.signOut();if(error)toast.error('Sign out failed. Please try again.');}
 function percentage(id:string){const course=courses.find(c=>c.id===id);if(!course)return 0;return Math.round(progress.filter(p=>p.course_id===id&&p.step===5).length/lessonsFor(course).length*100)}
 return <LearningContext.Provider value={{user,name,loading,progress,saving,completeStep,saveName,signOut,percentage}}>{children}</LearningContext.Provider>;
}
export function useLearning(){const value=useContext(LearningContext);if(!value)throw new Error('Learning provider missing');return value;}