# Design QA - Mockup Ummix Indústria

## Comparison target

- Source visual truth: `C:\Users\aryha\Downloads\screencapture-ummix-inclusao-ctrti-euedymedrado-chatgpt-site-2026-08-15-16_29_51 (1).pdf`
- Source raster used for inspection: `C:\Users\aryha\Documents\Ummix\plataforma\tmp\pdfs\reference-1.png`
- Independent implementation: `http://localhost:3004/`
- Screenshot evidence: Codex in-app browser captures, checked inline during this QA pass.

## Viewport and behavior

- Source: one portrait Letter page, 612 x 792 pt; raster inspection at 144 dpi, 1224 x 1584 px.
- Desktop implementation: CSS viewport 1440 x 1000 px.
- Mobile implementation: CSS viewport 390 x 844 px; no page-level horizontal overflow.
- Responsive behavior: the sidebar becomes a drawer, the stage rail scrolls within its own width, cards become a single column and the executive metrics stack at narrow widths.

## Demonstration state

- Initial audience: `Profissional da indústria`.
- Initial filters: `Grande Goiânia`, `Todas`, `Em busca de oportunidade`, `Todos os turnos`, `TV`.
- Initial scenario: `Mix recomendado`.
- All displayed metrics, audience totals, hourly values, media affinities, investments and impact scores are mock data.
- The isolation banner explicitly identifies the screen as a mockup without login or API.

## Evidence

- Visual: desktop and mobile captures show the source composition translated into a responsive standalone page: dark sidebar, project context, title, progress rail, audience/potential cards, filters, executive summary, scenario comparison, hourly chart, media ranking, plan CTA and transparency footer.
- Executive improvements: simulated investment, frequency, scenario reach, connection index, industrial shift filter, scenario comparison, rationale text and copy-summary action.
- Interaction: audience selection updates metrics and media ranking; city, accessibility, professional moment, shift and media filters update estimates; scenario tabs update the executive summary; hourly bars update the selected time window; recommendation, plan, copy and clear actions expose feedback; mobile navigation opens and closes.
- Browser console: no warning or error entries were returned in the final capture.
- Layout measurement: at the mobile capture, `document.documentElement.scrollWidth` and `document.body.scrollWidth` were both 375 px, matching the viewport.

## Required fidelity surfaces

- Typography: keeps the Ummix Design System roles, Baloo 2 for headings and Plus Jakarta Sans for interface/body with fallbacks. The visual detector flags Plus Jakarta Sans as broadly used; it is intentionally retained because it is the Ummix brand token and preserves the supplied reference.
- Layout rhythm: cards, gaps, rounded corners and hierarchy follow the supplied reference; mobile changes only structural layout and navigation behavior.
- Color: dark/mint/off-white palette follows the reference, with the Ummix canonical red used for the primary plan CTA and focus treatment.
- Assets: the standalone app uses an inline Ummix wordmark and Lucide React icons; it does not import assets or components from `web/`.
- Copy: Portuguese copy is adapted to the industrial inclusion scenario; source numbers and copy are demonstrative content, not production claims.

## Independence checklist

- [x] Separate app directory with its own `package.json`, Vite config and dependency lockfile.
- [x] No login redirect, authentication import, API client, campaign context or backend dependency.
- [x] The original `web` mockup files and route addition were removed without reverting pre-existing user changes.
- [x] Existing private `/dashboard` implementation and its local changes preserved.

## Verification checklist

- [x] `npm.cmd run build` passed.
- [x] TypeScript project build passed as part of the production build.
- [x] Desktop and mobile captures inspected.
- [x] Scenario, industrial shift, summary copy and mobile navigation interactions verified.
- [x] Browser console checked with no warnings or errors.

## Correção posterior

- `[P2]` O rótulo `Mix recomendado` podia ultrapassar o terceiro botão na comparação de cenários.
- Fix: removida a herança tipográfica conflitante do botão e aplicada quebra semântica entre `Mix` e `recomendado`, com largura controlada no terceiro cenário.
- Evidence: desktop e mobile renderizados novamente; o rótulo permanece dentro do botão e não há overflow horizontal.

final result: passed
