# Review notes: manage as well as browse (video 3)

## Creative calls
- Hook is the real Actions dropdown with a beat-stepped highlight; the menu's own labels do the pitching. Not built: a typed-command opener, a feature-card trio, a title over a dimmed screenshot.
- One feature per beat, hard cuts on the vol-9 grid (5.28, 7.92, 10.54, 12.65, 15.28, 17.91), each screen arriving at 1.035x and settling. Labels in the same white chip as video 1, bottom-left.
- The URL beat ends on a cursor click into the address chip and a selection highlight, so the last stretch is not static and the "it is a URL" point gets an action.
- The Restore tables screen was captured with the source tables listed and dev_ → qa_ applied on the import side; earlier attempts failed because the hidden Settings dialog shares the same input placeholders and swallowed the typed values.

## Measured vs looked at
- `npx hyperframes check --json`: 0 errors, 0 warnings after fixes (dead stretches removed, URL chip marked `data-layout-ignore` because the auditor counted it as 17 words).
- Review sheets and five targeted frames looked at; heading on the schema frame restored by raising the camera.
- Sound measured with `hyperframes audio` after loudness normalisation, not heard.

## Weakest shot
- Scene 1: at 1.75x the crop around the open menu leaves grey space top-left; the table heading "orders (120)" is outside the frame. A 1.6x crop would include it but drops menu text under 24 px.

## Warnings kept on purpose
- None remaining in `check`. The URL chip is exempt from the reading-time audit by design (a glance element; the caption carries the point).
