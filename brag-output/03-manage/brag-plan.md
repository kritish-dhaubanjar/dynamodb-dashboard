# Brag Plan: DynamoDB Dashboard — manage as well as browse

## What is this app?
An open-source (MIT) web GUI for DynamoDB that does more than list items: create and delete indexes, switch TTL and streams, read the table schema, copy tables between environments, import and export items, and share any scan or query as a URL.

## The angle
The Actions menu is the pitch. It is a real dropdown in the product and it already lists, in the product's own words, everything an engineer needs to manage a table: Delete Table, Truncate Table, Create/Delete Index, View Table Schema, Time to Live (TTL), Manage Streams, Import Items. The film opens on that menu, walks a highlight down it on the beat, then pays each line off with the real screen behind it, one feature per beat. No adjectives. The feature names are the copy.

## Hook (first 2-3 seconds)
The real Actions dropdown, open, punched in at 1.75x, a big cursor resting on the Actions button it just clicked. A thin accent highlight steps down the seven menu items on every beat. Caption: "Manage as well as browse."

## Key moments (the middle)
- The index row for `customerId-createdAt-index` (GSI, partition key customerId, sort key createdAt) on the Edit orders screen.
- TTL switched on with attribute `expiresAt`; the streams screen with view type "New and old images".
- The table schema JSON for orders (AttributeDefinitions, KeySchema, ItemCount 120).
- The Restore tables page: source tables listed, prefix dev_ → qa_ typed.
- The real scan URL in a browser-style address bar: `http://127.0.0.1:4567/dynamodb/?page=1&limit=50&tableName=orders&indexName=orders&operation=SCAN`.

## Outro / punchline
Lockup, `npm install --global dynamodb-dashboard`, "MIT. Not affiliated with Amazon Web Services."

## User flow worth showing
Entry: open the table's Actions menu → key action: pick a management action (index, TTL, streams, schema, copy) → result: the real screen for it. The montage is that flow, one action per beat.

## Tone
- Preset: app-store
- Creative direction: feature-forward with deadpan restraint; the product's own menu labels are the headlines
- Interpretation: 8 beats, hard cuts on the beat grid inside the montage, every screen arrives slightly large and settles, one short label per beat in the same white chip, sentence case, no adjectives, no exclamation marks.

## Format: landscape — 1920x1080
## Duration: 24.8 seconds

## Visual identity (from the project)
- Background: #f2f3f3
- Accent: #7393f7 (logo front), secondary #76c0e5 (logo rear); Bootstrap #0d6efd appears only inside screenshots
- Text: #212529; secondary #495057
- Display font: Roboto 500 (bundled)
- Body font: Roboto 400; code JetBrains Mono 500 (bundled)
- Strongest visual element: the open Actions dropdown; the dark JSON panels (One Dark) against the grey ground

## Share copy (draft)
DynamoDB Dashboard is more than a table viewer: indexes, TTL, streams, schema, JSON import and export, and table copies between environments, from the browser. npm or Docker, MIT.

## Audio direction
- Role: consistent light layer under a feature montage
- Music: happy-beats-business-moves-vol-9-by-ende-dot-app.mp3 (mid-energy, laid back)
- Music treatment: 0.32 from 0 s, 0.4 s fade-in, 1.5 s fade-out under the end card
- Music cue guidance: see below
- Audio-reactive treatment: none (deadpan restraint; the highlight walk already carries the beat)
- SFX posture: moderate; one click for the menu, one soft drop per cut rotating three takes, one bell on the end card; all low or medium HF risk, 0.45–0.6
- Audio-coupled moments: the menu click at the top, each hard cut, the mark landing
- Restraint rule: no sound on the highlight steps, no typing ticks, nothing above 0.6

## Music cue guidance
- Track: vol-9, 114.84 BPM, beat ≈ 0.5225 s (preset at the brag skill's assets/music/cues/)
- Beat grid used: highlight steps on 1.07, 1.59, 2.12, 2.65, 3.18, 3.70, 4.23 (every beat; non-text accents)
- Strong cues locked: montage starts 5.28; cuts at 7.92, 10.54, 12.65 (all strong), 15.28, 17.91; end card at 21.59
- Restraint: readability over the grid; labels hold their reading floor

## Storyboard

### Scene 1 — The menu — 5.28s
actions-menu.png at 1.75x focused on the open dropdown (top right of the scan screen). The whole frame lands slightly large and settles. A big cursor rests on the Actions button (it just clicked; one click sound at 0.2 s). From 1.07 s a 150x29 px accent highlight (rgba 115,147,247 at 18%, 3 px solid left edge) steps down the seven items on every beat, ending on "Import Items" at 4.23 s. Caption chip bottom-left from 0.6 s: "Manage as well as browse." (5 words; holds 4.6 s).
Sequential/interaction: yes — a cursor click (already landed), then seven beat-stepped highlight moves.
Audio intent: tempo established by the walk, not by sound
Audio-coupled idea: one click at the top; the highlight is silent
Music: vol-9 fades in
Transition mood: hard cut on 5.28 → Scene 2

### Scene 2 — Feature montage — 16.31s (5.28 → 21.59)
Six real screens, hard cuts on strong cues or beats, each arriving at 1.035x of its target scale and settling in 0.45 s, each with one label chip bottom-left arriving 0.05 s after its cut:
1. 5.28 → 7.92 (2.64 s) edit-table-orders.png at 1.5x on the index row. Label: "Create and delete indexes" (4 words, 1.7 s floor).
2. 7.92 → 10.54 (2.62 s) ttl-sessions.png at 1.7x on the TTL card. Label: "Time to Live (TTL)".
3. 10.54 → 12.65 (2.11 s) streams-sessions.png at 1.7x. Label: "Manage streams".
4. 12.65 → 15.28 (2.63 s) schema-orders.png at 1.6x on the heading and the top of the JSON. Label: "View table schema".
5. 15.28 → 17.91 (2.63 s) the Restore tables page with source tables listed and dev_ → qa_ in the prefix fields, at 1.5x on the Tables panel. Label: "Copy tables between environments" (4 words, 1.7 s floor).
6. 17.91 → 21.59 (3.68 s) orders-scan.png at 1.3x under a browser-style address chip (JetBrains Mono 28 px, white, 1 px border) showing the full real URL with `tableName=orders` and `operation=SCAN` underlined in the accent; the chip slides down into place at +0.3 s. Caption at +0.35 s: "Every scan and query is a URL." (7 words, 2.6 s floor; holds 3.3 s).
Sequential/interaction: yes — six screens one after another; the address chip slides in.
Audio intent: a light, even pulse
Audio-coupled idea: one soft drop on each cut, rotating drop_001/002/003
Music: steady
Transition mood: soft → Scene 3 (0.4 s fade under the end card)

### Scene 3 — End card — 3.21s (21.59 → 24.8)
Grey ground. Mark (130 px) and wordmark "DynamoDB Dashboard" lockup, then the command chip `npm install --global dynamodb-dashboard` in JetBrains Mono, then "MIT. Not affiliated with Amazon Web Services." (28 px, #495057). Dead still for the last 2.4 s.
Sequential/interaction: yes — mark, wordmark, chip, line, 0.3 s apart
Audio intent: resolve
Audio-coupled idea: one bell on the mark (impactBell_heavy_000 at 0.4)
Music: fades out over the last 1.5 s
Transition mood: hold → end

**Music mood for this video:** steady, light, unbothered
**Audio summary:** one click, six soft drops on the cuts, one bell, a mid-energy bed that fades under the card.
