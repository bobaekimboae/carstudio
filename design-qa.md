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

## End-to-end verification (2026-11-04)

- Tested the deployed app at `https://bobaekimboae.github.io/carstudio/` using eight local vehicle photos.
- Upload: passed — all 8 images appeared in the ordered photo list and enabled the next step.
- Vehicle details: passed — entered BMW / X4 / 2022 and a test price, then confirmed the summary reflected those values.
- Render: passed — generated a 9:16 MP4 from the eight photos in the browser. The result reported 10.547 seconds and decoded as 720 × 1280 with ready state 4.
- Preview: passed — the video played in the page.
- Download: passed — `carstudio-reel.mp4` downloaded successfully (6,669,815 bytes).
- Privacy: the app displayed that photos are processed in the browser and not sent to an upload server. The test used the deployed static app; no upload API was involved.
- Test data note: the test vehicle details were entered manually. The photo set includes a Mercedes-branded engine image, so this run validates the editing/render/download flow, not automatic vehicle recognition or the accuracy of the entered vehicle identity.
- Original service: no video was generated on Car Studio AI.
- Overall: **browser end-to-end flow passed**. Automatic AI recognition remains unconnected. The OpenAI narration endpoint and updated rendering selections are documented below; live TTS generation was not verified without a key.

## Selector and Korean narration fixes (2026-11-04)

- Template choice now changes the render layout and scene timing (Classic, Modern, Showcase, Neon, Collage); template preview reflects the card that was clicked.
- Palette choices, including custom colors, are applied to both the in-editor scene preview and rendered video.
- Ratio selection controls the render canvas; music choices create distinct synthesized backing patterns, and “음악 없음” removes the audio track unless narration is enabled.
- Buyer answers, mileage, power, engine, transmission, fuel, drivetrain, body, color, condition, price, seller contact, address and uploaded logo are included in the applicable video cards. The captions switch now turns scene text on/off separately from voiceover.
- Vehicle field edits preserve scroll position and focus. Template cards are keyboard selectable; music choices use semantic buttons.
- Korean narration copy is composed from entered vehicle facts only. The Node server includes an OpenAI TTS proxy with a server-side `OPENAI_API_KEY`, Korean delivery instructions, origin allowlist and basic rate limits. OpenAI's voice is not the original Car Studio voice.
- Production limitation: GitHub Pages cannot securely host the API key or the TTS endpoint. `config.js` is blank by default, so AI voice remains disabled on the public Pages app until an HTTPS backend endpoint and server key are configured. No key was present in the repository or supplied to the local server, so live AI audio generation was not verified in this turn.
- Compatibility note: OpenAI's current Speech API model named in `.env.example` is scheduled for shutdown on 2027-01-06; select a successor before that date.

