## 2026-07-31T21:00:44Z
<USER_REQUEST>
You are Worker 1 (Implementation Worker) assigned to implement Milestones 2 & 3 for project c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff.
Your working directory is: c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff/.agents/worker_m2_m3

Objective:
1. Fix the English/Spanish language toggle in the header/navbar so that it works correctly and updates global language state across all views/routes (R1).
2. Extract all hardcoded text across all React components into `src/data/translations.ts` (`TRANSLATIONS`) and ensure all components use dynamic references to `TRANSLATIONS[lang]` (R2).

Instructions & Reference Reports:
- Read Explorer 1 report: c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff/.agents/explorer_m1_1/analysis.md
- Read Explorer 2 report: c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff/.agents/explorer_m1_2/analysis.md
- Read Explorer 3 report: c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff/.agents/explorer_m1_3/analysis.md

Detailed Step-by-Step Implementation Tasks:
1. Update `src/data/translations.ts`:
   - Expand `TRANSLATIONS` object with comprehensive `es` and `en` key mappings for all views, components, headers, footers, modals, widgets, placeholders, form buttons, filter options, and messages.
   - Maintain strict symmetry between `es` and `en` dictionaries.
2. Fix Language Toggle & State (R1):
   - Ensure `lang` ('es' | 'en') state is reliably managed (in `App.tsx` or via a React `LanguageContext`) and passed/consumed by all components.
   - Ensure clicking the English/Spanish toggle in `Navbar.tsx` (header) updates `lang` state and forces immediate re-render of all active views and components.
3. Replace Hardcoded Strings with Dynamic References (R2):
   - Update `Footer.tsx` (currently imports `t` but never uses it) to dynamically render all footer content using `t.footer`.
   - Update `CookieBanner.tsx`, `WhatsAppWidget.tsx`, `ReCaptchaWidget.tsx`, `ProductDetailModal.tsx`, `ProductsView.tsx`, `RecipesView.tsx`, `HomeView.tsx`, `AboutView.tsx`, `IndustrialView.tsx`, `ContactView.tsx`, `RestrictedZoneView.tsx`, `AuthModal.tsx`, `Navbar.tsx`, and all other components to use dynamic references `TRANSLATIONS[lang].section.key`.
   - Ensure no user-facing text remains hardcoded in Spanish or English.
4. Verify Compilation & Build:
   - Run typecheck: `run_command` with `npm run lint` (`npx tsc --noEmit`).
   - Run build: `run_command` with `npm run build`.
   - Ensure 0 errors and zero broken imports.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Output Requirements:
- Write detailed change report to `c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff/.agents/worker_m2_m3/handoff.md`.
- Include build verification results (`npm run lint` and `npm run build`).
- Send a message to parent (ID: f33e4434-cfea-4dcc-a1d0-6e323086c1f4) upon completion.
</USER_REQUEST>
