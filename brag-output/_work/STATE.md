# /brag run state (paused 2026-10-22, usage limit)

Goal: three brag videos for DynamoDB Dashboard, landscape 1920x1080, 15-25 s each, no voiceover.
1. `brag-output/01-pitch/`   elevator pitch (what it is). Tone: polished. Music: vol-12.
2. `brag-output/02-how-to/`  install and first use. Tone: app-store. Music: vol-1 or vol-11.
3. `brag-output/03-manage/`  developer angle: manage as well as browse (indexes, TTL, streams, JSON import/export, copy tables dev_ -> qa_, shareable scan/query URLs). Tone: app-store or deadpan. Music: vol-9.
Copy must follow `.claude/brand-voice-guidelines.md` (Quick Reference): display name "DynamoDB Dashboard", tagline "A web GUI to browse and manage DynamoDB, local or remote.", no marketing adjectives, sentence case, "DynamoDB Local" / "a real AWS account".

## Environment already prepared
- Isolated demo DB: docker container `brag-dynamodb-local` (amazon/dynamodb-local, in-memory, port 8001). Fictional data only. Safe to remove: `docker rm -f brag-dynamodb-local`. Re-seed after restart: `cd _work && npm i @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb && node seed.js`.
- The user's own `dynamodb-local` container on port 8000 was NOT touched.
- Dashboard: `npx -y dynamodb-dashboard@1.26.1 start -p 4567 -h 127.0.0.1 -d` with env AWS_REGION=us-west-2 AWS_ENDPOINT=http://localhost:8001 AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey. Was left running in the background; stop with `lsof -ti :4567 | xargs kill`.
- Installed: ffmpeg via Homebrew (required by hyperframes render). hyperframes 0.8.185 runs via `npx -y hyperframes`; its skills live at `~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/skills/{hyperframes,hyperframes-cli,media-use}` (no hyperframes-core etc.; read `hyperframes/SKILL.md`, `references/format.md`, `motion.md`, `look.md`, `sound.md`, `hyperframes-cli/SKILL.md`).
- Screenshot harness: `capture.js` (puppeteer-core 22.15 + chrome-headless-shell at ~/.cache/puppeteer). `cd _work && npm i puppeteer-core@22.15.0 && node capture.js pass1.json` writes `out/*.png` at 1600x1000 @2x.

## Screenshots captured (shots/)
home, home-orders, create-table, schema-orders, ttl-sessions, streams-sessions, restore, create-item-orders, edit-table-orders.
Items screen URL pattern: `/dynamodb/?page=1&limit=50&tableName=orders&indexName=orders&operation=SCAN` (QUERY and `parameters` also supported). Routes: `/table/create-table`, `/table/<t>/table-schema|edit-table|ttl|streams`, `/table/restore-tables`, `/<t>/create-item|edit-item`.
Still wanted: orders scan with stats strip, events QUERY by deviceId=sensor-07, edit-item JSON editor, dark-mode toggle, Actions menu open, Restore Tables mid-copy.

## Status 2026-10-22 (final)
- All three videos rendered, loudness-normalised (-15 to -16 LUFS, true peak <= -0.9 dBTP), posters baked at frame 0, share copy written:
  - 01-pitch/brag.mp4 (22.0 s), 02-how-to/brag.mp4 (23.0 s), 03-manage/brag.mp4 (24.8 s)
- Demo services stopped: dashboard on 4567 killed, container brag-dynamodb-local removed. To re-render after edits: `docker run -d --name brag-dynamodb-local -p 8001:8000 amazon/dynamodb-local:latest -jar DynamoDBLocal.jar -inMemory -sharedDb`, re-seed with `_work/seed.js`, start the dashboard as above, then `cd <video>/composition && npx -y hyperframes@0.8.185 check --json && npx -y hyperframes@0.8.185 render --quality delivery --output ../brag.mp4`, then the poster bake and loudnorm steps.
- Pipeline notes: `immediateRender: false` on every non-first fromTo per target; `data-layout-allow-overflow` on camera wrappers; SFX data-duration = file length; a cursor must not carry data-layout-ignore or dead_stretch ignores it; the hidden Settings dialog shares input placeholders with the Restore form and comes first in the DOM, so scope selectors to the form; the Explore Tables button text contains a hidden "Loading..." span.
- Nothing committed. brag-output/.gitignore excludes .hyperframes, node_modules, renders and capture scratch.
