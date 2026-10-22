# Hyperframes Composition Brief: DynamoDB Dashboard (how-to)

## Objective
A short how-to video: install, start, pick a table, edit an item as JSON, save.

## Output
- Composition directory: `brag-output/02-how-to/composition/`
- Rendered video: `brag-output/02-how-to/brag.mp4`
- Format: landscape — 1920x1080, 30 fps
- Duration: 23 seconds

## Source Material
- Project root: /Users/leapfrog/Projects/maskeynihal/dynamodb-dashboard
- Primary files read: README.md (install, start, docker run), server/src/bin/server.js (startup line), app/src/views/items/EditItem.vue (toast copy), .claude/brand-voice-guidelines.md
- Product name: DynamoDB Dashboard
- Tagline / strongest claim: "A web GUI to browse and manage DynamoDB, local or remote."
- Key UI or visual moment to recreate: terminal typing (HTML), the Tables list → orders scan (`home.png`, `orders-scan.png`), the Edit item JSON editor (`edit-item.png`), the success toast
- Copy that must appear verbatim:
  - npm install --global dynamodb-dashboard
  - dynamodb-dashboard start
  - dynamodb-dashboard started at: http://127.0.0.1:4567/dynamodb
  - The item has been saved successfully.
  - docker run -p 8080:4567 kritishdhaubanjar/dynamodb-dashboard
  - MIT. Not affiliated with Amazon Web Services.

## Creative Direction
- Tone preset: app-store
- Creative direction: clean feature cards over the real product; followable with the sound off
- Interpretation: one action per scene; clicks cause the cuts; captions are one sentence in a white chip; no adjectives
- Angle: terminal → browser → one item edited and saved → how to install
- Hook: the install command typing itself in
- Outro / punchline: lockup + both install commands + MIT / non-affiliation line
- Avoid: generic SaaS language, abstract visuals, invented UI, dark voids, glows

## Visual Identity
- Background: #f2f3f3
- Text: #212529; secondary #495057
- Accent: #7393f7; secondary #76c0e5
- Display font: Roboto 500 (bundled)
- Body font: Roboto 400; code JetBrains Mono 500 (bundled)
- Visual references from the project: logo.svg, square corners, 1 px #e3e3e3 borders, editor background #282c34, Bootstrap text-bg-success toast

## Storyboard
Use the storyboard in `brag-output/02-how-to/brag-plan.md` as the creative contract.

Scene summary:
1. Terminal — 6.5s — two commands type in, the real startup line prints
2. Pick a table — 6.5s — cursor clicks orders, scan result with stats strip, cursor clicks an item
3. Edit the item — 3.6s — JSON editor, pan to Save Changes, click on the strong cue
4. Saved — 3.4s — success toast at the top
5. End card — 4.0s — lockup, npm and docker chips, MIT line

## Audio
- Audio role: consistent light layer
- Audio arc: bed in, typing ticks, three clicks, a drop, a bell, bed out
- Music: assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3
- Music treatment: 0.30, fade-in 0.4 s, fade-out 1.5 s
- Music cue guidance: vol-1 preset; seams on the 0.5 s grid; Save click on the 16.02 strong cue
- Audio-reactive treatment: none
- Audio-coupled moments: typing ticks (keyboard/keypress-*.wav, every second character, 0.3 volume); click_003 on three clicks; impactSoft_medium_001 on the browser landing; drop_001 on the toast; bong_001 on the lockup
- SFX selection guidance: low HF risk only
- Exact SFX choice: as listed; timestamps from the implemented animation
- Audio files: copied into `composition/assets/`

## Hyperframes Instructions
Same contract as video 1: one scene per sub-composition, prefixed ids, `fromTo` with `immediateRender: false` on non-first tweens, hosts on distinct tracks with ascending z-index, `data-layout-allow-overflow` on camera wrappers, bundled fonts, root-relative asset paths, `check --json` with zero errors before `render --quality delivery`.
