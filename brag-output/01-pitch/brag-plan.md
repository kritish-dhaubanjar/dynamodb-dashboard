# Brag Plan: DynamoDB Dashboard — elevator pitch

## What is this app?
An open-source (MIT) web GUI for DynamoDB: run it from npm or Docker, point it at DynamoDB Local or a real AWS account, then browse tables, scan and query items, edit items as JSON, manage indexes, TTL and streams, and copy tables between environments.

## The angle
No pitch, just the thing. The product name lands at full scale in its own two blues, then the real UI fills the frame and the camera walks through one real scan of a real table (fictional seed data). The claim is the tagline and nothing more: a web GUI to browse and manage DynamoDB, local or remote. Confidence through restraint, which is also the brand voice: direct, precise, no adjectives.

## Hook (first 2-3 seconds)
The two "D" shapes of the logo slide into overlap on the product's own grey ground, and the wordmark "DynamoDB Dashboard" sets itself letter by letter. Nothing else on screen.

## Key moments (the middle)
- The orders table scan at 1.6x: the camera arrives on the stats strip "Items returned: 100 • Items scanned: 100 • Efficiency: 100.00 %" and holds while the item rows settle beneath it.
- The Settings/connection dialog punched in: Region, Endpoint `http://localhost:8001`, credentials, Connect. Label: "DynamoDB Local or a real AWS account."
- A four-cut montage of real screens: Create Table, TTL, Streams, Edit item (the JSON editor), each with a short label.

## Outro / punchline
Mark and wordmark return, smaller, with the install command under them: `npm install --global dynamodb-dashboard`. Last line: "MIT. Not affiliated with Amazon Web Services." Hold.

## User flow worth showing
Entry: pick a table from the Tables list → key action: Scan runs → result: stats strip and item rows. Shown as one continuous camera move over the real screenshot, not three cuts.

## Tone
- Preset: polished
- Creative direction: quiet product film for engineers; the UI is the hero, type is a caption
- Interpretation: 5 scenes, long holds on the UI, soft 0.6 s crossfades between worlds and hard cuts only inside the montage; sentence-case captions in Roboto, one accent colour (logo periwinkle) rationed to one word or element per scene; zero marketing adjectives.

## Format: landscape — 1920x1080
## Duration: 21 seconds

## Visual identity (from the project)
- Background: #f2f3f3 (App.vue .wrapper)
- Accent: #7393f7 (logo front shape), secondary #76c0e5 (logo rear shape)
- Text: #212529 (Bootstrap body ink used throughout the UI)
- Display font: Roboto 500 (bundled in HyperFrames)
- Body font: Roboto 400; code in JetBrains Mono 500 (both bundled)
- Strongest visual element: the Scan/Query panel plus the green stats strip; the logo's two overlapping D shapes

## Share copy (draft)
Introducing DynamoDB Dashboard: a web GUI to browse and manage DynamoDB, local or remote. npm or Docker, MIT.

## Audio direction
- Role: warm bed, sparse professional accents
- Music: happy-beats-business-moves-vol-12-by-ende-dot-app.mp3 (steady and clean; the polished pick)
- Music treatment: start at 0 s at 0.30, short fade-in 0.4 s, duck to 0.18 under the end card from 18.0 s, fade out over the last 1.2 s
- Music cue guidance: see "Music cue guidance" below
- Audio-reactive treatment: subtle; music RMS may breathe the soft shadow under the UI frame and the warmth of the end-card mark by a few percent, never text
- SFX posture: sparse; three cues at most, all low high-frequency risk
- Audio-coupled moments: the wordmark letters settling (one soft drop, not per-letter ticks), the UI frame landing (one soft impact), the end-card mark landing (one soft bell)
- Restraint rule: no click sounds on montage cuts, no typing ticks, nothing above 0.7 volume

## Music cue guidance
- Track: vol-12 (preset cue file read at composition time from the brag skill's assets/music/cues/)
- Strong cues: lock the UI reveal (scene 2 start, ~3.0 s) and the end-card mark landing (~18.2 s) to the nearest strong cues within ±0.15 s; leave the hook on natural timing so the letters read.
- Beat grid: the four montage cuts (scene 4) may snap to consecutive beats or every other beat so each label holds ≥0.8 s.
- Restraint: polished tone; cues bias timing, readability wins.

## Storyboard

### Scene 1 — Mark — 3.2s
Grey ground #f2f3f3. The rear D (#76c0e5) slides in from the right, the front D (#7393f7) from the left, overlapping into the logo at centre, 22% of frame height. 0.5 s later the wordmark "DynamoDB Dashboard" (Roboto 500, ~7% frame height, ink) sets letter by letter below the mark. At 1.9 s the tagline "A web GUI to browse and manage DynamoDB, local or remote." (Roboto 400, ~3.2% height, grey #495057) blurs in as one line. Holds to the end of the scene.
Sequential/interaction: yes — two logo shapes arrive one after the other; wordmark letters stagger 0.06 s.
Audio intent: quiet arrival; the room is empty before the product appears
Audio-coupled idea: one soft drop when the two shapes meet; no per-letter sound
Music: vol-12 bed fades in
Transition mood: soft → Scene 2 (the UI frame rises from below and the mark shrinks away, 0.6 s crossfade)

### Scene 2 — The scan — 6.0s
The real orders-scan screenshot fills the frame inside a white window with a 1 px #e3e3e3 border and a soft shadow, scaled 1.6x so UI text is ≥26 px. Camera path: starts on the Tables list (orders highlighted), moves right to the Scan/Query panel, then down to the green stats strip "Items returned: 100 • Items scanned: 100 • Efficiency: 100.00 %" and holds; the item rows sit below. Caption lower-left (Roboto 400, 3% height): "Scan or query a table or index." arrives at 1.2 s and holds.
Sequential/interaction: yes — one continuous camera move with three stops (list → panel → stats strip), 0.5 s each with motion blur, holds between.
Audio intent: the product doing its job, calm
Audio-coupled idea: one soft impact when the window lands at scene start (beat-locked)
Music: bed steady
Transition mood: soft → Scene 3 (blur swap on the same stage, 0.4 s)

### Scene 3 — Local or remote — 4.0s
The connection dialog screenshot (Settings: Region, Endpoint, Access key, Secret, Session token, Connect) punched in at 1.8x, centred, over the dimmed scan behind it. Endpoint field reads `http://localhost:8001`. Caption lower-left: "DynamoDB Local or a real AWS account." with "or" in the accent colour.
Sequential/interaction: none (the dialog is already open; it arrives slightly large, 1.04 → 1.0, and settles)
Audio intent: a beat of stillness
Audio-coupled idea: none
Music: bed steady
Transition mood: clean → Scene 4 (hard cut on the first montage frame)

### Scene 4 — Manage — 4.0s
Four real screens, hard cuts every 1.0 s, each punched to 1.6x on its form: Create Table (partition key / sort key fields) · TTL (attribute name, toggle) · Streams (view type) · Edit item (JSON editor with a real order). Each cut carries a short label bottom-left in Roboto 500, 3.5% height: "Create table" · "TTL" · "Streams" · "Edit items as JSON" (the first three hold 1.09 s each on every other beat; the last holds 2.18 s).
Sequential/interaction: yes — four screens one after another, labels arrive with their screen.
Audio intent: tempo without noise
Audio-coupled idea: cuts may snap to the beat grid (every other beat); no SFX on cuts
Music: bed steady
Transition mood: soft → Scene 5 (the last screen blurs out, 0.5 s)

### Scene 5 — End card — 3.8s
Grey ground. Mark (12% height) and wordmark lockup centred, the mark landing with a soft bell. Under it, in JetBrains Mono 500 on a white chip with a 1 px border: `npm install --global dynamodb-dashboard`. Last line, small grey: "MIT. Not affiliated with Amazon Web Services." Everything holds dead still for the final 2.5 s.
Sequential/interaction: yes — mark, then wordmark, then the command chip, then the last line, 0.3 s apart.
Audio intent: resolve
Audio-coupled idea: soft bell on the mark landing (beat-locked); music ducks under the card and fades
Music: duck to 0.18 at scene start, fade out over the last 1.2 s
Transition mood: hold → end

**Music mood for this video:** steady, clean, quiet
**Audio summary:** a single clean bed under a near-silent product film, three soft accents (shapes meet, UI lands, mark lands), the bed stepping back for the end card.
