# Hyperframes Composition Brief: DynamoDB Dashboard (manage as well as browse)

## Objective
A feature-forward, deadpan 25-second video showing that DynamoDB Dashboard manages tables, not only browses them, for engineers who already run DynamoDB.

## Output
- Composition directory: `brag-output/03-manage/composition/`
- Rendered video: `brag-output/03-manage/brag.mp4`
- Format: landscape — 1920x1080, 30 fps
- Duration: 24.8 seconds

## Source Material
- Project root: /Users/leapfrog/Projects/maskeynihal/dynamodb-dashboard
- Primary files read: README.md, app/src (HomeTable.vue actions menu, EditTable.vue, TableTTL.vue, TableStreams.vue, TableSchema.vue, RestoreTables.vue), .claude/brand-voice-guidelines.md
- Product name: DynamoDB Dashboard
- Tagline / strongest claim: the Actions menu itself: Delete Table · Truncate Table · Create/Delete Index · View Table Schema · Time to Live (TTL) · Manage Streams · Import Items
- Key UI or visual moment to recreate: screenshots in `brag-output/_work/out` and `brag-output/_work/shots` (actions-menu.png, edit-table-orders.png, ttl-sessions.png, streams-sessions.png, schema-orders.png, orders-scan.png, plus the Restore tables capture made for this video)
- Copy that must appear verbatim:
  - Manage as well as browse.
  - Create and delete indexes
  - Time to Live (TTL)
  - Manage streams
  - View table schema
  - Copy tables between environments
  - Every scan and query is a URL.
  - http://127.0.0.1:4567/dynamodb/?page=1&limit=50&tableName=orders&indexName=orders&operation=SCAN
  - npm install --global dynamodb-dashboard
  - MIT. Not affiliated with Amazon Web Services.

## Creative Direction
- Tone preset: app-store
- Creative direction: feature-forward with deadpan restraint; the product's own menu labels are the headlines
- Interpretation: one feature per beat, hard cuts on the beat grid, each screen arrives slightly large and settles, one label chip per beat, sentence case, no adjectives
- Angle: open on the real Actions dropdown, walk a highlight down it on the beat, then pay off each item with its real screen.
- Hook: the open Actions menu with the cursor on the button; "Manage as well as browse."
- Outro / punchline: lockup, install command, MIT and non-affiliation line
- Avoid:
  - Any adjective about the product; any competitor name
  - Three cards in a row, icons in circles, title over a dimmed screenshot
  - Redesigning or redrawing UI; screenshots are shown as they are

## Visual Identity
- Background: #f2f3f3
- Text: #212529; secondary #495057
- Accent: #7393f7 (bars and highlights only, never as text colour); secondary #76c0e5
- Display font: Roboto 500 (bundled)
- Body font: Roboto 400; code JetBrains Mono 500 (bundled)
- Visual references from the project: logo.svg, square corners, 1 px #e3e3e3 borders, One Dark JSON panels

## Storyboard
Use the storyboard in `brag-output/03-manage/brag-plan.md` as the creative contract.

Scene summary:
1. The menu — 5.28s — Actions dropdown at 1.75x, cursor on the button, highlight steps down seven items on the beat, caption "Manage as well as browse."
2. Feature montage — 16.31s — six real screens with labels: indexes, TTL, streams, schema, copy tables, shareable URL
3. End card — 3.21s — lockup, command chip, MIT / non-affiliation line

## Audio
- Audio role: consistent light layer
- Audio arc: bed in under the menu, even through the montage, fades under the end card
- Music: assets/music/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3
- Music treatment: 0.32, 0.4 s fade-in, 1.5 s fade-out
- Music cue guidance: vol-9 preset; highlight steps on every beat from 1.07 to 4.23; cuts locked to 5.28, 7.92, 10.54, 12.65, 15.28, 17.91; end card 21.59
- Audio-reactive treatment: none
- Audio-coupled moments:
  - 0.2 s menu click — interface/click_003
  - each cut — interface/drop_001 / drop_002 / drop_003 rotating
  - 21.59 s mark — impact/impactBell_heavy_000 at 0.4
- SFX selection guidance: low or medium HF risk only, 0.45–0.6; nothing on the highlight steps
- SFX analysis guidance: brag skill assets/sfx/sfx-analysis.md
- Exact SFX choice: Hyperframes places timestamps after the animation exists
- Audio files: in `composition/assets/`

## Hyperframes Instructions
Follow the bundled `hyperframes` skill contract and `hyperframes-cli`. One scene per sub-composition with prefixed ids, hosts on distinct `data-track-index` with ascending z-index, `fromTo` only with `immediateRender: false` on every non-first tween per target, `data-layout-allow-overflow` on camera wrappers, audio `data-duration` equal to file length, screenshots through a 1600x1000 wrapper scaled 1.3–1.75, all our text ≥ 28 px inside the title-safe area. Gate with `npx hyperframes check --json` (zero errors), review with `snapshot --review`, render locally with `--quality delivery`.
