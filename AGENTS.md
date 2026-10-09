<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep public academy pages in TanStack file routes and share header/bottom navigation in one shell, so all screens have consistent navigation.
- Define curriculum and lesson IDs in one browser-safe catalog module, so outlines, completion calculations and resume behavior use the same source.
- Store profiles and per-lesson learning steps in Lovable Cloud with owner-only RLS, so progress is private and survives across devices.
- Lesson content is an introductory scaffold; only claim features that exist (the Virtual Computer Lab ships; videos, simulators beyond the lab and certificates do not yet).
- Virtual Lab exercises check completion from real pointer interactions and save completion as learning_progress rows under the lab course ID, so no extra table is needed.
