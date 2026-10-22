# Brag Plan: DynamoDB Dashboard — how to use it

## What is this app?
An open-source (MIT) web GUI for DynamoDB: install from npm or run the Docker image, point it at DynamoDB Local or a real AWS account, then browse tables, scan and query items, edit items as JSON, manage indexes, TTL and streams.

## The angle
A how-to with no narrator: the terminal, then the browser, then one item edited and saved. Every frame is the product doing its job, captions are one short sentence each. The viewer leaves knowing exactly what to type and what happens next.

## Hook (first 2-3 seconds)
A terminal card on the product's grey ground. `$ npm install --global dynamodb-dashboard` types itself in with soft key ticks. Caption: "Install from npm, then start."

## Key moments (the middle)
- The real startup line prints: `dynamodb-dashboard started at: http://127.0.0.1:4567/dynamodb`.
- In the browser, a big cursor clicks `orders` in the Tables list and the scan result appears with its stats strip and item rows.
- The cursor opens an item: the Edit item JSON editor with a real order; the cursor goes to Save Changes.
- Save Changes: the green toast "The item has been saved successfully." lands at the top of the page.

## Outro / punchline
Lockup, then two chips: `npm install --global dynamodb-dashboard` and `docker run -p 8080:4567 kritishdhaubanjar/dynamodb-dashboard`. Last line: "MIT. Not affiliated with Amazon Web Services."

## User flow worth showing
Entry: install and start from the terminal → key action: pick a table, open an item, edit JSON → result: Save Changes and the success toast.

## Tone
- Preset: app-store
- Creative direction: clean feature cards over the real product; a how-to a stranger can follow with the sound off
- Interpretation: 5 scenes, one action per scene, slide/wipe transitions caused by a click, sentence-case captions in white chips, no adjectives; typing is the only "effect".

## Format: landscape — 1920x1080
## Duration: 23 seconds

## Visual identity (from the project)
- Background: #f2f3f3 (App.vue .wrapper)
- Accent: #7393f7 (logo front shape), secondary #76c0e5 (logo rear shape)
- Text: #212529
- Display font: Roboto 500 (bundled)
- Body font: Roboto 400; code JetBrains Mono 500 (bundled)
- Terminal card: #282c34 (the product's own editor background), text #e6e6e6, prompt in #76c0e5
- Strongest visual element: the Tables list + scan result with the stats strip; the JSON editor

## Share copy (draft)
DynamoDB Dashboard is now live. Install from npm or Docker, pick a table, scan or query it, edit items as JSON — all in the browser.

## Audio direction
- Role: consistent light layer (app-store)
- Music: happy-beats-business-moves-vol-1-by-ende-dot-app.mp3 (upbeat, 120 BPM)
- Music treatment: 0.30 volume, 0.4 s fade-in, fade out over the last 1.5 s
- Music cue guidance: preset read; beat grid is 0.5 s from 3.02 s; strong cues 16.02, 17.02, 18.52, 20.02 s. Scene seams sit on the grid (6.02, 12.52, 16.12, 19.02) and the Save click lands on the 16.02 strong cue.
- Audio-reactive treatment: none (the typing and clicks carry the rhythm)
- SFX posture: light and motion-matched: randomized soft keypress ticks on every second typed character, one click per cursor click, one soft impact when the browser lands, one soft drop when the toast lands, one soft bell on the end card
- Audio-coupled moments: typing (scene 1), three cursor clicks (scenes 2-3), toast landing (scene 4), lockup (scene 5)
- Restraint rule: ticks at 0.35 volume or lower, clicks at 0.5, nothing above 0.6; no whooshes on cuts

## Music cue guidance
- Track: vol-1 preset (120 BPM). Beat grid every 0.5 s from 3.02 s.
- Strong cue lock: Save Changes click at 16.02 s; end card at 19.02 s (grid) with the lockup settled by 20.02 s (strong).
- Beat-grid windows: scene seams on 6.02 / 12.52 / 16.12 / 19.02.

## Storyboard

### Scene 1 — Terminal — 6.5s (fades out from 6.02)
Grey ground. A dark terminal card (1280x520, #282c34, square corners) centred. `$ npm install --global dynamodb-dashboard` types in character by character from 0.4 s (0.045 s per character) with soft key ticks every second character; Enter; a second prompt; `$ dynamodb-dashboard start` types from 2.7 s; Enter; at 4.3 s the real startup line prints: `dynamodb-dashboard started at: http://127.0.0.1:4567/dynamodb`. Caption bottom-left from 0.3 s: "Install from npm, then start."
Sequential/interaction: yes — typed text, two commands, then output.
Audio intent: quiet, mechanical, the only sound is typing over the bed
Audio-coupled idea: randomized keypress ticks on every second character
Music: bed fades in
Transition mood: clean → Scene 2 (the terminal blurs out, the browser lands slightly large and settles)

### Scene 2 — Pick a table — 6.5s (6.02 → 12.52)
The real home screen (Tables list with dev_orders selected, Scan/Query panel) at 1.6x. Cursor enters from off-screen, rests on `orders` and clicks at 7.52 s; on the rebound the screen becomes the orders scan (same framing), then the camera pushes to 1.8x on the stats strip "Items returned: 100 • Items scanned: 100 • Efficiency: 100.00 %" and the first item rows at 8.52 s. The cursor moves to the first item link `ord_7f387cf3` and clicks at 12.3 s. Caption from 6.6 s: "Pick a table, then scan or query it."
Sequential/interaction: yes — cursor click on `orders`, result appears, cursor click on an item.
Audio intent: the product responding to clicks
Audio-coupled idea: click_003 on each click; impactSoft when the browser lands
Music: bed steady
Transition mood: hard cut on the click rebound → Scene 3

### Scene 3 — Edit the item — 3.6s (12.52 → 16.12)
The Edit item screen at 1.6x: heading "Edit item", the JSON editor with the real order. At 14.6 s the camera pans down so Save Changes is in frame; the cursor arrives on Save Changes at 15.4 s and clicks at 16.02 s (strong cue). Caption from 12.9 s: "Edit an item as JSON."
Sequential/interaction: yes — camera pan, cursor move, click.
Audio intent: focus
Audio-coupled idea: click_003 on the click
Music: bed steady
Transition mood: hard cut on the click rebound → Scene 4

### Scene 4 — Saved — 3.4s (16.12 → 19.52, fades out from 19.02)
Same screen, the camera back on the top of the page at 1.7x, where the green toast "The item has been saved successfully." drops in at the top centre. Caption from 16.5 s: "Changes saved to the table."
Sequential/interaction: yes — toast lands.
Audio intent: a small resolve
Audio-coupled idea: drop_001 when the toast lands
Music: bed steady
Transition mood: soft → Scene 5 (crossfade 0.5 s)

### Scene 5 — End card — 4.0s (19.02 → 23.0)
Grey ground. Lockup (mark + "DynamoDB Dashboard"), then two chips on separate lines in JetBrains Mono: `npm install --global dynamodb-dashboard` and `docker run -p 8080:4567 kritishdhaubanjar/dynamodb-dashboard`, then "MIT. Not affiliated with Amazon Web Services." Everything still from 20.3 s.
Sequential/interaction: yes — lockup, chip, chip, line, 0.3 s apart.
Audio intent: resolve
Audio-coupled idea: bong_001 on the lockup
Music: fades out over the last 1.5 s
Transition mood: hold → end

**Music mood for this video:** upbeat, clean
**Audio summary:** one upbeat bed, typing ticks for the first six seconds, one click per cursor click, a drop on the toast and a bell on the lockup.
