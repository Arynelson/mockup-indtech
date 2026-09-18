# Design QA - Mockup Ummix Ads para Indústria

## Comparison target

- Primary product reference: current `C:\Users\aryha\Documents\Ummix\plataforma\web`, inspected read-only for the application shell, wizard stages, typography, palette and component rhythm.
- Contextual visual reference: `C:\Users\aryha\Downloads\screencapture-ummix-inclusao-ctrti-euedymedrado-chatgpt-site-2026-08-15-16_29_51 (1).pdf`
- Source raster used for the contextual inspection: `C:\Users\aryha\Documents\Ummix\plataforma\tmp\pdfs\reference-1.png`
- Independent implementation: `http://localhost:3004/`
- Screenshot evidence: Codex in-app browser captures, checked inline during this QA pass.
- Scope boundary: neither `web` nor `services` is imported or modified; the page remains a local demonstrator with mock values.

## Viewport and behavior

- Source: one portrait Letter page, 612 x 792 pt; raster inspection at 144 dpi, 1224 x 1584 px.
- Desktop implementation: CSS viewport 1440 x 1000 px.
- Mobile implementation: CSS viewport 390 x 844 px; no page-level horizontal overflow.
- Responsive behavior: the sidebar becomes a drawer, the stage rail scrolls within its own width, cards become a single column and the executive metrics stack at narrow widths.

## Demonstration state

- Initial audience: `Profissional da indústria`.
- Initial profile filters: `Pessoas com deficiência: Todas`, `Jovem Aprendiz: Todos`, `Faixa Etária: Todas`.
- Initial context filters: `Grande Goiânia`, `Todas`, `Em busca de oportunidade`, `Todos os turnos`, `TV`.
- Initial scenario: `Mix recomendado`.
- All displayed metrics, audience totals, hourly values, media affinities, investments and impact scores are mock data.
- The isolation banner explicitly identifies the screen as a mockup without login or API.
- The demonstrative flow intentionally omits `Objetivo da Campanha`, `Reconhecimento da Marca`, `Formato` and `Duração do Spot`.

## Evidence

- Visual: desktop and mobile captures show the industrial flow translated into a responsive standalone page using the current platform language: neutral-900 sidebar, neutral-50 canvas, white cards, Arial typography, canonical red CTA, project context, four-stage progress rail (`Campanha`, `Configuração`, `Público-Alvo`, `Finalização`), audience/potential cards, filters, executive summary, scenario comparison, hourly chart, media ranking, plan CTA and transparency footer.
- Executive improvements: simulated investment, frequency, scenario reach, connection index, industrial shift filter, scenario comparison, rationale text and copy-summary action.
- Interaction: audience selection updates metrics and media ranking; the three `Perfil & Hábitos` filters plus city, accessibility, professional moment, shift and media update estimates; scenario tabs update the executive summary; hourly bars update the selected time window; recommendation, plan, copy and clear actions expose feedback; mobile navigation opens and closes.
- Browser console: no warning or error entries were returned in the final capture.
- Layout measurement: at the mobile capture, `document.documentElement.scrollWidth` and `document.body.scrollWidth` were both 375 px, matching the viewport.

## Required fidelity surfaces

- Typography: follows the current `web` implementation with Arial, Helvetica, sans-serif, preserving the platform's compact, direct interface tone.
- Layout rhythm: the 256px dark sidebar, neutral page canvas, white rounded cards, form controls and four-step progress rail follow the current platform shell; mobile changes only structural layout and navigation behavior.
- Color: neutral-900, neutral-50, white and neutral borders follow the current platform, with Ummix canonical red `#9B191A` for active steps, focus treatment and primary CTA; green remains reserved for completed or positive simulated states.
- Assets: the standalone app uses an inline Ummix Ads wordmark and Lucide React icons; it does not import assets or components from `web/`.
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
