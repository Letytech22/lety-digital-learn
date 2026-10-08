import { Monitor, FileText, Sheet, Presentation } from 'lucide-react';

export const steps = ['Learn', 'Watch', 'Practice', 'Try Alone', 'Quiz'];
export const courses = [
  { id: 'computer-basics', title: 'Computer Basics', short: 'Your digital journey starts here.', description: 'Get comfortable with computers, from your first click to managing files.', icon: Monitor, color: 'bg-secondary text-primary', duration: '3 hours', modules: [
    { title: 'Introduction to Computers', lessons: ['What is a computer?', 'Desktops, laptops & tablets', 'Your smartphone is a computer'] },
    { title: 'Parts of a Computer', lessons: ['Monitor, keyboard & mouse', 'The system unit & USB', 'Speakers, printers & accessories'] },
    { title: 'Using a Mouse', lessons: ['Point, click & double-click', 'Right-click & scrolling', 'Drag and drop'] },
    { title: 'Keyboard Skills', lessons: ['Letters, numbers & space', 'Enter, Shift & Caps Lock', 'Useful keyboard shortcuts'] },
    { title: 'Desktop Basics', lessons: ['Icons, windows & menus', 'Opening and closing programs', 'Minimizing & switching windows'] },
    { title: 'Files and Folders', lessons: ['Create and name a folder', 'Save & Save As', 'Copy, move & delete files'] },
  ] },
  { id: 'word-processing', title: 'Word Processing', short: 'Turn your ideas into documents.', description: 'Create, format and share professional everyday documents with confidence.', icon: FileText, color: 'bg-blue-soft text-blue-ink', duration: '3 hours', modules: [
    { title: 'Getting Started', lessons: ['Meet the document workspace', 'Create your first document', 'Save and open a document'] },
    { title: 'Working with Text', lessons: ['Type and edit text', 'Select, copy & paste', 'Fonts, sizes & emphasis'] },
    { title: 'Formatting a Document', lessons: ['Paragraphs & alignment', 'Bullets and numbered lists', 'Page layout & margins'] },
    { title: 'Finishing and Sharing', lessons: ['Add images and tables', 'Check spelling & review', 'Export, print & share'] },
  ] },
  { id: 'spreadsheets', title: 'Spreadsheets', short: 'Make numbers work for you.', description: 'Organize information, build a simple budget and explore everyday calculations.', icon: Sheet, color: 'bg-warm text-warm-foreground', duration: '4 hours', modules: [
    { title: 'Spreadsheet Essentials', lessons: ['Rows, columns & cells', 'Enter and edit information', 'Save your workbook'] },
    { title: 'Organizing Information', lessons: ['Format text and numbers', 'Resize rows & columns', 'Sort and filter data'] },
    { title: 'Everyday Calculations', lessons: ['Your first formula', 'SUM and AVERAGE', 'Build a personal budget'] },
    { title: 'Presenting Data', lessons: ['Create a simple chart', 'Choose the right chart', 'Print and share a sheet'] },
  ] },
  { id: 'presentations', title: 'Presentations', short: 'Share ideas that stand out.', description: 'Build clear, engaging slides and feel ready to present your ideas.', icon: Presentation, color: 'bg-lilac-soft text-lilac-ink', duration: '3 hours', modules: [
    { title: 'Your First Presentation', lessons: ['Meet the slide workspace', 'Create and arrange slides', 'Choose layouts and themes'] },
    { title: 'Building Your Slides', lessons: ['Add titles and text', 'Use pictures and shapes', 'Keep slides clear and readable'] },
    { title: 'Bringing Ideas to Life', lessons: ['Transitions and animations', 'Speaker notes', 'Practice your slideshow'] },
    { title: 'Presenting with Confidence', lessons: ['Plan a short presentation', 'Present and navigate slides', 'Export and share slides'] },
  ] },
];
export type Course = typeof courses[number];
export function lessonsFor(course: Course) { return course.modules.flatMap((m, mi) => m.lessons.map((title, li) => ({ id: `${mi}-${li}`, title, module: m.title }))); }
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} — Lety Digital Academy` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — Lety Digital Academy` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }

export function lessonContent(course: Course, title: string) {
  if (course.id === 'computer-basics') return { text: `A computer is a device that receives information, processes it, and produces a result. A laptop, tablet and smartphone all work this way. In “${title}”, start by noticing the tools you already use. The screen shows information, the keyboard enters text, and the mouse or touchscreen lets you select things. You do not need to own a computer to understand these ideas.`, task: 'Look at your phone. Identify the screen, find where you enter text, and tap an app to open it. These are examples of output, input, and a program.', question: 'Which of these is an input device?', answers: ['A keyboard', 'A monitor', 'A speaker'], correct: 0 };
  if (course.id === 'word-processing') return { text: `Word processing helps you create written documents such as a letter, CV or report. “${title}” is part of this process. Start with a clear title, write short paragraphs, and use formatting to make important information easy to read. Save your document with a name that describes its contents.`, task: 'In your phone’s notes app, write a short letter introducing yourself. Add a title, your name, and two sentences about a skill you want to learn.', question: 'What is the best name for a saved job application letter?', answers: ['Document1', 'My Job Application', 'Untitled'], correct: 1 };
  if (course.id === 'spreadsheets') return { text: `A spreadsheet organizes information in rows and columns. Their intersection is called a cell. Each cell can contain text, a number or a formula. “${title}” helps you organize everyday information, like expenses. A formula begins with an equals sign; =2+3 calculates five.`, task: 'Write down three expenses and their amounts in your notes. Place names on the left and amounts on the right, then use your calculator to add the amounts.', question: 'What does a spreadsheet formula begin with?', answers: ['A full stop (.)', 'A hashtag (#)', 'An equals sign (=)'], correct: 2 };
  return { text: `A presentation is a sequence of slides that helps an audience understand your ideas. “${title}” builds this skill. Keep one main idea on each slide, use a short title and avoid long paragraphs. Large, readable text and relevant images help your audience follow along.`, task: 'Plan three slides in your notes: introduce yourself, share one idea you care about, and finish with a short takeaway. Give each slide one clear title.', question: 'What makes a slide easier to understand?', answers: ['One clear main idea', 'Very small text', 'Many long paragraphs'], correct: 0 };
}