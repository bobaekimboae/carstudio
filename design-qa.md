# Design QA — Car Studio Korean creator

## Source captured

- Source: `https://app.carstudio.ai/en/editor/video?source=upload`
- Read-only screenshots captured at the source desktop viewport (about 1086 × 872): photo upload screen, footer, car details top/middle, template cards, palette preview, output formats and music/voice settings.
- The current source tab was visually clear of the authentication dialog. The accessibility tree also retained hidden OTP nodes; screenshots were used to confirm that the visible editor was open.
- Source showed the BMW X4 photo set (10 photos), an auto-filled BMW / X4 / 2022 vehicle form, five templates, twelve color palettes, 9:16 / 1:1 / 16:9 output, five music choices and voiceover controls. The source Create Video action was not used.

## Local implementation

- Korean upload and details screens follow the observed two-column layout, light gray canvas, orange accents, white cards and dark sticky summary.
- The UI adapts to narrow screens with stacked summary, two-column forms, and mobile photo/template grids.
- Interactions implemented: add/remove/reorder photos, language selection, vehicle fields, buyer Q&A toggles, logo, templates and preview, palettes, output ratio, music preview, rendering, playback and download.
- No original Car Studio code or prior project source was reused.

## Comparison / status

- Desktop source observation: passed for the captured states listed above.
- Mobile source capture: not available through the connected browser viewport controls, so exact source-vs-local mobile screenshot comparison remains unverified.
- AI recognition and AI narration are not connected to Car Studio or another AI provider. The local build uses manual vehicle details, captions and synthesized background tones.
- MediaRecorder emits MP4 only when supported by the browser; otherwise it emits WebM. MP4 compatibility should be checked in the target deployment browser.
- Overall: **partial** — desktop visual structure and local creation flow are implemented; mobile visual comparison and AI/MP4 integration remain open.

