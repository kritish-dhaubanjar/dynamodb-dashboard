# Hyperframes Composition Brief: DynamoDB Dashboard (elevator pitch)

## Objective
Create a short, polished elevator-pitch video for DynamoDB Dashboard aimed at engineers who use DynamoDB.

## Output
- Composition directory: `brag-output/01-pitch/composition/`
- Rendered video: `brag-output/01-pitch/brag.mp4`
- Format: landscape — 1920x1080, 30 fps
- Duration: 21 seconds

## Source Material
- Project root: /Users/leapfrog/Projects/maskeynihal/dynamodb-dashboard
- Primary files read: README.md, app/index.html, app/src/assets/main.css, app/src/App.vue, app/src/assets/logo.svg, .claude/brand-voice-guidelines.md
- Product name: DynamoDB Dashboard
- Tagline / strongest claim: "A web GUI to browse and manage DynamoDB, local or remote."
- Key UI or visual moment to recreate: the real orders-scan screen (screenshot `brag-output/_work/shots/orders-scan.png`) with its green stats strip; the connection dialog (`connection.png`); Create Table, TTL, Streams, Edit item screens (`create-table.png`, `ttl-sessions.png`, `streams-sessions.png`, `edit-item.png`)
- Copy that must appear verbatim:
  - DynamoDB Dashboard
  - A web GUI to browse and manage DynamoDB, local or remote.
  - Scan or query a table or index.
  - DynamoDB Local or a real AWS account.
  - npm install --global dynamodb-dashboard
  - MIT. Not affiliated with Amazon Web Services.

## Creative Direction
- Tone preset: polished
- Creative direction: quiet product film for engineers; the UI is the hero, type is a caption
- Interpretation: long holds, soft crossfades between worlds, hard cuts only inside the montage, sentence case, one accent word per scene, no adjectives
- Angle: the product name lands, the real UI fills the frame, one real scan is walked through by the camera, local-or-remote is shown as the connection dialog, four real management screens cut past (create table, TTL, streams, the JSON item editor), the install command closes.
- Hook: the two logo shapes slide into overlap, the wordmark sets letter by letter.
- Outro / punchline: mark + wordmark + `npm install --global dynamodb-dashboard` + "MIT. Not affiliated with Amazon Web Services."
- Avoid:
  - Generic SaaS language and any adjective about the product
  - Abstract filler visuals, dark voids, glows, gradients, particles
  - Three cards in a row, a title over a dimmed screenshot (the dialog scene dims the background only because the real UI does)
  - Redesigning the UI; screenshots are shown as they are

## Visual Identity
- Background: #f2f3f3
- Text: #212529; secondary text #495057
- Accent: #7393f7; secondary #76c0e5 (logo blues only; never Bootstrap #0d6efd for new elements)
- Display font: Roboto 500 (bundled)
- Body font: Roboto 400 (bundled); code JetBrains Mono 500 (bundled)
- Visual references from the project: logo.svg (two overlapping D shapes), square corners everywhere (rounded-0), 1 px #e3e3e3 borders, green stats strip (Bootstrap alert-success)

## Storyboard
Use the storyboard in `brag-output/01-pitch/brag-plan.md` as the creative contract.

Scene summary:
1. Mark — 3.2s — logo shapes meet, wordmark sets, tagline blurs in
2. The scan — 6.0s — real orders scan at 1.6x, camera list → panel → stats strip; caption "Scan or query a table or index."
3. Local or remote — 4.0s — connection dialog at 1.8x; caption "DynamoDB Local or a real AWS account."
4. Manage — 4.0s — four real screens, hard cuts, labels "Create table" · "TTL" · "Streams" · "Edit items as JSON"
5. End card — 3.8s — lockup, install command chip, MIT / non-affiliation line, hold

## Audio
- Audio role: warm bed, sparse professional accents
- Audio arc: bed fades in under the mark, holds steady through the UI scenes, ducks and fades under the end card
- Music: assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3
- Music treatment: 0.30 volume, 0.4 s fade-in, duck to 0.18 from 17.2 s, fade out over the last 1.2 s
- Music cue guidance: preset at the brag skill's assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json; lock scene 2 start and the end-card mark to the nearest strong cues (±0.15 s); montage cuts may use every other beat
- Audio-reactive treatment: subtle; the UI window's shadow opacity and the end-card mark's warmth may follow RMS by a few percent; never text
- Audio-coupled moments:
  - Scene 1 shapes meet — one soft drop (interface/drop_001)
  - Scene 2 window lands — one soft impact (impact/impactSoft_medium_000)
  - Scene 5 mark lands — one soft bell (interface/bong_001 at low volume)
- SFX selection guidance: three cues total, volumes 0.45–0.6, low high-frequency risk; no cut sounds, no typing
- SFX analysis guidance: brag skill assets/sfx/sfx-analysis.md
- Exact SFX choice: Hyperframes chooses timestamps after the animation exists
- Audio files: copy the chosen music and SFX into `composition/assets/`

## Hyperframes Instructions
Follow the bundled `hyperframes` skill (SKILL.md contract, references/format.md, motion.md, look.md, sound.md) and `hyperframes-cli`. One scene per sub-composition, ids prefixed per scene, `fromTo` tweens only, paused timelines registered under the host id, root-relative asset paths, bundled fonts by name. Keep all text ≥ 28 px at 1080 and inside the title-safe area. Run `npx hyperframes check --json` as the single gate before render; render locally with `--quality delivery`.
