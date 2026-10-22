# DynamoDB Dashboard Brand Voice Guidelines

## Generation Metadata
- Created: 2026-10-22
- Version: 1 (approved 2026-10-22)
- Replaces: none
- Sources: Brand discovery report dated 2026-10-22, 26 sources: 19 operational artifacts (README, package manifests, CLI, in-product UI copy, styles, distribution files, git history, GitHub repo page and releases, npm registry, Docker Hub), 2 conversational (GitHub issue threads, one forum URL), 3 contextual (logo, favicon, landscape web search), 2 stale (sub-READMEs, README mirrors). Source IDs below (S1 to S26) refer to section 3 of that report. "Conflict N" refers to section 5 of that report.
- Documents processed: 0 brand documents.
- Conversations analyzed: 0 sales or meeting transcripts. 4 GitHub issue threads (#1437, #1655, #1826, #1899).
- Discovery report used: Yes
- QA pass: 2026-10-22. Two critical and fifteen suggested findings resolved before this draft was shown.
- Overall confidence: Low (aggregate 0.50; bands: 0.85 to 1.0 High, 0.60 to 0.84 Medium, below 0.60 Low). No authoritative brand source exists. This document is a proposal grounded in observed copy. See Confidence Scores for what raises it.
- Audience brief (from the project owner): technical engineers who use DynamoDB and want a GUI dashboard to run and manage DynamoDB, local or remote.
- Applied assumptions: where the discovery report left an open question unanswered, the agent's recommended answer is applied here and tagged "[applied Qn]", where Qn is the question number in the discovery report. Each is listed again under Open Questions for confirm-or-override. One recommendation was revised (Q4) and the revision is disclosed there.

---

## Executive Summary

DynamoDB Dashboard is an open-source (MIT) web GUI for Amazon DynamoDB. It installs from npm in two commands or runs as a Docker image, connects to DynamoDB Local during development or to a real AWS account through the standard credential chain, and lets an engineer browse tables, scan and query items, edit items as JSON, manage indexes, TTL and streams, and copy tables between environments (S1, S9 to S13, S15). Its readers are working engineers who already know DynamoDB. They do not need to be sold on DynamoDB, and they do not want to be sold at all. They want to know what the tool does, how to start it, and what will happen when they click.

The voice that already exists in the best parts of the project is direct, precise, and candid about consequences: the README puts the install command before any paragraph, the CLI help is lowercase and fragmentary, and the destructive flows reviewed (truncate, delete, restore) name the outcome before the red button ("This action cannot be reversed.", S11). The maintainer's replies in issues add a warmth the product copy lacks: fast acknowledgement, a public apology for an unannounced breaking change, and "Let me look into it." (S21). These guidelines keep that voice and extend it to the places where it currently slips: a browser tab that calls the product "DynamoDB Management Console" (S5), UI help text written in an AWS-console register (S12, inference), passive success toasts, and raw SDK errors pasted into notifications (S4).

Content should feel like a senior teammate who set up the local stack: terse, correct, respectful of your time, and honest about risk. Never like a vendor, and never like Amazon.

### Quick Reference (for people and for LLMs)
1. Display name is **DynamoDB Dashboard**. Identifiers (npm, CLI, Docker, repo) are `dynamodb-dashboard`. Never "Management Console". [applied Q1]
2. Name, one-line tagline, then the install block. No paragraph before the install block. (Exception: a community post may open with one sentence of what-it-is before the command.)
3. Use DynamoDB's own nouns: table, item, partition key, sort key, index (GSI/LSI), endpoint, region. Never "record" or "database".
4. Before any destructive action, state what will be lost and whether it can be undone. Then the button. The reversibility sentence is always "This action cannot be reversed."
5. Errors say what failed, the likely cause, and the next step. Never paste a raw SDK error alone.
6. Sentence case everywhere in the UI. No UPPERCASE buttons, no Title Case labels.
7. No marketing adjectives. No "powerful", "seamless", "simply", "just", "easily", "blazing".
8. Assume DynamoDB literacy. Do not explain what a partition key is; do say which one this table uses.
9. Say "DynamoDB Local" for the local emulator and "a real AWS account" for remote. Local dev is the first scenario in any example. [applied Q4, revised; see Open Questions item 4]
10. Never imply AWS affiliation. The line "Not affiliated with Amazon Web Services." goes in the README intro, the GitHub About description, and the Docker Hub full description. Community posts may omit it. [applied Q6]
11. Own mistakes in public: say what broke, what changed, and what to do.
12. Keep one canonical tagline string across README, GitHub About, npm, Docker Hub and CLI help.

---

## We Are / We Are Not

Voice is constant across the README, the UI, the CLI, release notes, and replies in issues. Warmth and emoji flex by context (see the tone matrix); the attributes below do not.

| We Are | We Are Not |
|--------|------------|
| **Direct**: say what the tool does and what will happen, in the fewest words that are still complete sentences | **Vague or promotional**: benefits without mechanics, adjectives without facts |
| **Precise**: use DynamoDB's vocabulary exactly, and use it the same way everywhere | **Loose with terms**: "records", "database", "restore" for a copy, labels that drift between screens |
| **Candid about consequences**: name the destructive outcome before the button, and say whether it can be undone | **Alarmist or hedging**: scary language without specifics, or softening that hides the risk |
| **Engineer-to-engineer**: assume DynamoDB literacy and treat the reader as a peer | **A tutorial or an imitation console**: beginner hand-holding, or AWS-console phrasing adopted wholesale |
| **Accountable**: acknowledge fast, say what we did, report back | **Defensive or silent**: breaking changes without a note, bugs without an owner |
| **Independent**: an open-source tool that works with DynamoDB, built by its community | **Amazon-branded**: anything that implies AWS made, endorses, or hosts this |

### Voice Attributes Detail

#### Attribute 1: Direct
- **What it means**: The reader gets the fact or the action first. Context follows only if it changes what the reader does.
- **How it shows up**: Install block before any paragraph in the README. CLI help in short fragments. Toasts that state the result in three words. Headlines that name the object and the change.
- **What to avoid**: Opening with what the product "empowers" you to do (illustrative). Three-sentence preambles. Restating the obvious ("Scan/query a table or index" shown twice on one panel, S11).
- **Evidence**: "dynamodb-dashboard started at: <URL>" (S4). "show log output for running app" (S3). "port to run app" (S3, cli.js line 13).
- **Confidence**: Medium. Consistent across README, CLI and log output, but inferred from practice, not from written guidance.

#### Attribute 2: Precise
- **What it means**: Terms mean exactly what they mean in DynamoDB, and the same word is used for the same thing on every screen.
- **How it shows up**: "Partition key" and "Sort key" in forms (S12). "Items returned" and items scanned in the stats strip (S11, report 4.7). GSI and LSI named as such.
- **What to avoid**: Calling items "records" in the import warning (S10). Calling tables a "database" (S12 and API routes). Calling a cross-environment copy "Restore" (S12). Leaking code constants into labels ("SCAN", "QUERY", S11).
- **Evidence**: Terminology table in the discovery report, section 4.5. The crossed wiring of "Truncate Table" and "Drop/Create Table" (S10) shows what imprecision costs.
- **Confidence**: Medium. The intent is visible and mostly consistent; the lapses are specific and fixable.

#### Attribute 3: Candid about consequences
- **What it means**: A destructive action is described as what it destroys, in the dialog, before the confirming control. Reversibility is stated, not implied.
- **How it shows up**: Consequence sentence, then a red button. A warning strip on flows that modify existing data.
- **What to avoid**: "Are you sure?" with no specifics (illustrative). Burying the warning below the button. Overstating risk on safe actions so that warnings lose meaning.
- **Evidence**: "You are about to truncate ... table." (S10). "This action cannot be reversed." (S11). "These changes are destructive." (S12, Restore Tables). "This action will modify existing data" (S10, import).
- **Confidence**: Medium. The pattern repeats across four separate flows written at different times.

#### Attribute 4: Engineer-to-engineer
- **What it means**: The reader runs DynamoDB. We do not define DynamoDB concepts; we tell the reader which concept applies here and what the tool will do with it.
- **How it shows up**: README assumes env vars, Docker Compose, Nginx and the AWS credential chain (S1, S15). Form labels use the real concept names. Examples use DynamoDB Local with fake credentials, which is how engineers actually run it.
- **What to avoid**: Explaining what a partition key is. Marketing register. Copying AWS console help text, which is written for a broader audience and makes the product sound like a clone (S12, inference).
- **Evidence**: README credential-resolution section (S1). Issue threads show users on compose setups and on real accounts with SSO, both speaking as peers (S21).
- **Confidence**: Medium. Strong in README and issues; the UI help text currently contradicts it.

#### Attribute 5: Accountable
- **What it means**: When something breaks, we say so, say what changed, and say what to do. Fast acknowledgement is part of the product.
- **How it shows up**: Observed: issue replies that acknowledge within the thread, and one release note rewritten by hand after a complaint (v1.24.1, #1655, S21). Target: every release note leads with user-visible change and carries a "Breaking:" line, even when it says "none".
- **What to avoid**: Auto-generated release notes as the only record (Dependabot lines, no highlights, S20, conflict 14). Silence after a breaking change.
- **Evidence**: Maintainer apologised publicly for shipping breaking changes without an announcement and rewrote the v1.24.1 notes (#1655, paraphrased, S21). "Let me look into it." (#1437, S21). Users thanked the maintainer for quick turnaround (paraphrased, S21).
- **Confidence**: Low. Four issue threads from one maintainer. Enough to describe the behaviour, not enough to call it a documented standard.

#### Attribute 6: Independent
- **What it means**: The product is a community-built, MIT-licensed tool (S16, S19) that talks to DynamoDB. It is not an AWS product and should never read like one.
- **How it shows up**: Product name and logo on the product chrome, not AWS naming. A non-affiliation line wherever the product is described. Help text in our own words.
- **What to avoid**: The current tab title "DynamoDB Management Console" (S5). Help text that mirrors console wording (S12, inference). A page background that reads as AWS console grey (S6, inference).
- **Evidence**: No non-affiliation note exists anywhere (report section 6). The tab title (S5) and the forum slug describing the UI as close to Amazon's (S24) suggest AWS-console parity was the implied pitch (report 4.2, inference); this guide corrects that pitch.
- **Confidence**: Low. This attribute is a correction of current practice, adopted under [applied Q1, Q6], not an observed pattern.

---

## Brand Personality

- **Archetype**: The senior teammate who set up the local stack. Knows DynamoDB cold, shows you the command instead of describing it, warns you before you blow away a table, and answers issues quickly (S21).
- **If our brand were a person**: Terse in writing, generous in help. Lowercase in the terminal, full sentences in the dialog that deletes your data. Apologises once, clearly, then ships the fix. Has opinions about naming things correctly.
- **Core values expressed in voice**: Clarity over polish. Respect for the reader's time. Honesty about risk. Openness (MIT, public issues, public fixes). Correctness of terms.
- **Confidence**: Medium. Derived from the six attributes above; the archetype is an interpretation. Not part of the aggregate score.

---

## Messaging Framework

### Primary Value Proposition [applied Q4, revised]
**A web GUI to browse and manage DynamoDB, local or remote.**

Canonical tagline (use this exact string in README, GitHub About, npm description, Docker Hub short description and CLI help):
> A web GUI to browse and manage DynamoDB, local or remote.

Note on wording: the discovery report recommended "run and manage" (its Q4), matching the audience brief. This draft revises it to "browse and manage" because the tool does not start DynamoDB; the compose file does (S15). The revision is disclosed under Open Questions item 4 for confirm-or-revert.

Variations observed today (to be replaced by the canonical string):
- "A Web GUI Dashboard for local or remote DynamoDB." (S1, S19, S23)
- "GUI Dashboard for local or remote DynamoDB" (S2, S3, S22)

Positioning paragraph (for README intro, GitHub About long form, Docker Hub full description, launch posts):
> DynamoDB Dashboard is an open-source web GUI for DynamoDB. Point it at DynamoDB Local during development or at a real AWS account, then browse tables, scan and query items, edit items as JSON, manage indexes, TTL and streams, and copy tables between environments. Install from npm or run the Docker image. MIT licensed. Not affiliated with Amazon Web Services.

### Key Message Pillars

1. **Local-first dev loop**
   - Core idea: Pair it with DynamoDB Local and see your tables in a browser after two commands, or one compose file.
   - When to use: First scenario in README, launch posts, npm and Docker Hub descriptions.
   - Example phrasing: "Start DynamoDB Local, then: `dynamodb-dashboard start`. Open http://localhost:4567/dynamodb."
   - Evidence: README example uses `AWS_ENDPOINT=http://localhost:8000` with fake keys (S1); compose files bundle `amazon/dynamodb-local` (S15); GitHub topic `dynamodb-local` (S19).
   - Confidence: Medium.

2. **Same UI for a real AWS account**
   - Core idea: The same tool works against AWS through the standard credential chain, including profiles and SSO, and you can switch region, endpoint and credentials at runtime.
   - When to use: Second scenario in README; answers to "does it work with my real tables?" (illustrative question).
   - Example phrasing: "Credentials resolve through the AWS SDK default chain: env vars, ~/.aws, SSO, instance metadata. Set AWS_REGION."
   - Evidence: README credential section (S1); Settings dialog with region, endpoint, keys and Connect (S9); issue #1899 on AWS_PROFILE with mounted ~/.aws (S21).
   - Confidence: Medium.

3. **Manage as well as browse**
   - Core idea: Tables, indexes, TTL, streams, item editing, bulk delete, import and export of items as JSON, and cross-environment table copy, from the browser.
   - When to use: Feature list in README (currently missing, conflict 8), release notes, comparison answers.
   - Example phrasing: "Create and delete tables and indexes, toggle TTL and streams, scan or query with filters, edit items as JSON, import and export items as JSON, copy tables from one environment to another."
   - Evidence: Feature inventory, discovery report 4.7 (S9 to S13).
   - Confidence: High for the facts, Medium for the framing.

4. **Open and self-hosted**
   - Core idea: MIT licensed (S16), distributed through npm and Docker (S22, S23), runs on your machine or in your network. No desktop install, no licence.
   - When to use: Closing line of positioning; answers to "why not a desktop client?" (illustrative question).
   - Example phrasing: "MIT licensed. Runs from npm or Docker on your machine or in your network."
   - Evidence: LICENSE (S16); npm and Docker channels (S22, S23); Nginx reverse-proxy example (S1).
   - Confidence: High for the facts, Low for whether to make it a pillar (not stated anywhere today).

### Competitive Positioning [applied Q5: neutral, no named comparisons in the tagline]
Use these only as internal framing until each competitor claim is verified against the competitor's own current documentation. Do not publish a comparison table yet.
- vs. AWS NoSQL Workbench: Workbench is a desktop, design-time tool (modeling, visualising). DynamoDB Dashboard is a browser tool for day-to-day data and table operations, self-hostable, and pairs with DynamoDB Local in compose. Overlap on table copy; verify before claiming (S26, low confidence).
- vs. Dynobase: paid desktop client. DynamoDB Dashboard is free and MIT, web-based, no licence. Do not comment on Dynobase's features (vendor-biased source, S26).
- vs. dynamodb-admin: the lineage (early README, GitHub topic, forum slug; S18, S19, S24). If verification shows dynamodb-admin lacks them, position on table management, indexes, TTL, streams and cross-environment copy. Verify its current feature set first.
- vs. the AWS console: the console manages resources in an AWS account and does not connect to a DynamoDB Local endpoint (general knowledge; not researched in discovery, report 4.9). The dashboard uses one UI for local and remote. Verify the wording against AWS documentation before publishing.
- vs. status quo (CLI and ad-hoc scripts): browsing items as JSON, shareable scan and query URLs (S11), and a visible stats strip beat `aws dynamodb scan | jq` for exploration.
- Confidence: Low. One web search, no verified competitor documentation.

---

## Tone-by-Context Matrix

Voice is constant. Tone flexes on three dimensions, each rated Low, Medium or High (ranges allowed). Warmth and emoji are permitted only in issue and discussion replies. The template's sales contexts are replaced with the contexts this product actually publishes in.

| Context | Formality | Energy | Technical Depth | Key Principle |
|---------|-----------|--------|-----------------|---------------|
| README and docs | Medium | Low | High | Command first, prose second |
| In-product labels and help text | Medium | Low | High | Name the object, state the effect |
| Destructive-action dialogs | Medium-High | Low | Medium | Consequence before the button |
| Error messages | Medium | Low | Medium-High | What failed, likely cause, next step |
| CLI and log output | Low | Low | High | One line, lowercase, no decoration |
| Release notes | Medium | Medium | Medium | Lead with user-visible change; call out breaking changes |
| Issue and discussion replies | Low-Medium | Medium (warm) | Medium-High | Acknowledge, act, report back |
| Community and launch posts (forums, Reddit, HN, social) | Low | Medium-High | Medium | One command, one screenshot, no hype |
| Registry listings (npm, Docker Hub, GitHub About) | Medium | Low | Medium | One canonical line, identical everywhere |

### Context-Specific Guidelines

#### README and docs (Confidence: Medium)
- **Overall tone**: Reference manual written by someone in a hurry who still cares. Short sections, code blocks, defaults stated.
- **Opening approach**: Logo, name, canonical tagline, badges, then the install block. The positioning paragraph comes after the install block, not before.
- **Do's**: State every default (port 4567, host, prefix `/dynamodb`). Show the DynamoDB Local scenario first, then the real-account scenario with the credential chain. Include the feature list. Include the network-exposure note (see Open Questions item 9). Keep claims current (the SDK is v3; conflict 7).
- **Don'ts**: No "Welcome to" (illustrative). No feature adjectives. No claims that lag the code (README says 127.0.0.1, CLI binds 0.0.0.0, conflict 5).
- **Example**: "Install globally, then start:" followed by the two commands (adapted from S1 L14).

#### In-product labels and help text (Confidence: Medium)
- **Overall tone**: Label the thing, state what changes. Sentence case. No help text that explains DynamoDB; only help text that explains what this form will do.
- **Do's**: "Partition key", "Sort key", "Index name". Placeholders that name the field ("Index name"), not another field ("Enter the partition key name", conflict 10). One term per concept across screens.
- **Don'ts**: UPPERCASE button labels ("SCAN", "QUERY", "RUN", "RESET", S11). Duplicate descriptions on one panel. AWS console phrasing lifted verbatim.
- **Example**: "Scan or query a table or index" once, as the panel heading; buttons "Scan" and "Query".

#### Destructive-action dialogs (Confidence: Medium)
- **Overall tone**: Calm, specific, final. The dialog is the last honest sentence before data is gone.
- **Do's**: Name the table or the count. Say what is deleted. End with "This action cannot be reversed." Then the button, whose label is the action, not "OK" or "Confirm".
- **Don'ts**: "Are you sure?" alone (illustrative). Two similar actions in one dialog without saying how they differ (Truncate vs Drop/Create, S10). Mismatched singular and plural (title "N items", body "N item", conflict 10).
- **Example**: "You are about to delete all 1,204 items in orders. This action cannot be reversed." Button: "Delete all items". (Model sentence; pattern from S10 and S11.)

#### Error messages (Confidence: Low)
- **Overall tone**: Diagnostic. Three parts: what failed, the most likely cause, the next step. The raw SDK message is kept, in parentheses or a details toggle, for the engineer who wants it.
- **Do's**: Name the endpoint, region or table involved. Suggest the env var or setting to check.
- **Don'ts**: A toast containing only the raw AWS SDK or validator error (S4 handler passes JSON straight through).
- **Example**: "Couldn't connect to http://localhost:8000 (ECONNREFUSED). Check that DynamoDB Local is running and AWS_ENDPOINT points to it." (Model sentence.)
- Note: no well-formed error copy exists in the product today, so this context is extrapolated from the voice attributes. Confidence rises once two or three real messages are written and reviewed.

#### CLI and log output (Confidence: Medium)
- **Overall tone**: Unix. Lowercase, fragments, no punctuation theatre, no emoji.
- **Do's**: One line per event. State the URL on start. Describe options as noun phrases ("port to run app", S3).
- **Don'ts**: Banners, colours that carry meaning on their own, progress spinners that hide errors.
- **Example**: "dynamodb-dashboard started at: <URL>" (S4), where <URL> is the bound address, for example http://0.0.0.0:4567/dynamodb.

#### Release notes (Confidence: Medium)
- **Overall tone**: A changelog a human wrote for a human who has to decide whether to upgrade.
- **Do's**: Lead with user-visible changes in plain words. A "Breaking:" line, even when it says "none". Group dependency bumps under one line or omit them. Keep conventional-commit prefixes out of the headline.
- **Don'ts**: Auto-generated "What's Changed" as the whole note (S20). Typos in headlines ("trucate", conflict 10).
- **Example**: see the model release note under Content Examples.

#### Issue and discussion replies (Confidence: Low)
- **Overall tone**: Warm, quick, concrete. The one place the voice is allowed a thank-you and an occasional emoji.
- **Do's**: Thank the reporter in the first line. Say what you will do or what you found. Link the commit or PR. Say which version carries the fix. Apologise plainly when something shipped wrong, once.
- **Don'ts**: Closing without a reason. Blaming the reporter's setup before reproducing. Long explanations where a link to the fix will do.
- **Example**: see the model issue reply under Content Examples. Modelled on the maintainer's pattern in S21: "Let me look into it."

#### Community and launch posts (Confidence: Low)
- **Overall tone**: A peer showing a tool they made. Honest about scope, specific about features, nothing superlative.
- **Opening approach**: What it is in one sentence (the exception to Quick Reference 2), who it is for in half a sentence, the one command, one screenshot.
- **Do's**: Name the local-first scenario. Say MIT. Ask for feedback on something specific.
- **Don'ts**: "Excited to announce" (illustrative). Comparisons to named competitors that are not verified. Hashtag strings.
- **Example**: "I built a web GUI for DynamoDB that works against DynamoDB Local and a real AWS account: tables, scan and query, JSON item editing, indexes, TTL, streams, and copying tables between environments. npm or Docker, MIT. `npm i -g dynamodb-dashboard && dynamodb-dashboard start`. Feedback welcome, especially on the cross-environment copy flow." (Model post.)
- Note: only one third-party post exists (LocalStack forum, S24, unread body). This context is extrapolated.

#### Registry listings (Confidence: Medium)
- **Overall tone**: The canonical tagline, then the install command, then the positioning paragraph where the listing allows length.
- **Do's**: Identical tagline string in the npm `description` field, the Docker Hub short description, the GitHub About description and the CLI `.description()`. The positioning paragraph, with the non-affiliation line, in the README (which npm renders), the Docker Hub full description and the GitHub About if length allows. Aligned keywords and topics (today npm keywords and GitHub topics differ, conflict 4).
- **Don'ts**: Different taglines per channel (conflict 3). Stale defaults on third-party mirrors (S25, conflict 16) are outside our control, so make the canonical sources correct and dated.

---

## Terminology Guide

### Must-Use Terms
| Term | Usage | Instead Of | Example |
|------|-------|------------|---------|
| DynamoDB Dashboard | Display name in prose, product chrome, tab title, README heading [applied Q1] | "DynamoDB Management Console", "DynamoDB" alone as the app name | "DynamoDB Dashboard 1.26.1" |
| `dynamodb-dashboard` | Package, CLI binary, Docker image, repo, log lines | Any casing variant in identifiers | `npm install --global dynamodb-dashboard` |
| DynamoDB | Always this casing in prose | "dynamodb", "Dynamo", "DDB" | "works with DynamoDB Local or a real AWS account" |
| DynamoDB Local | AWS's local emulator | "local dynamo", "the emulator" | "Start DynamoDB Local on port 8000" |
| table | The DynamoDB unit | "database" | "copy tables between environments" |
| item | One entry in a table, identified by its key | "record", "row", "document" | "Items returned: 50" |
| partition key, sort key | Key schema terms in UI and docs | "hash key", "range key" (code only) | "Partition key: pk (String)" |
| index, GSI, LSI | Spell out "global secondary index" on first use in prose; GSI/LSI in labels | "secondary table" | "Create a GSI on status" |
| endpoint, region | Connection fields | "URL", "server", "zone" | "Endpoint: http://localhost:8000" |
| credentials | Access key, secret key, session token together | "login", "password" | "Credentials resolve through the AWS SDK default chain" |
| scan, query | The two item-retrieval operations, sentence case. ("Search" remains fine for the table-list filter, "Find tables by table name".) | "SCAN", "search" (for items) | "Query the index by partition key" |

### Preferred Terms (proposed renames; see Open Questions item 6)
| Term | Usage | Example |
|------|-------|---------|
| Connection | Title of the dialog that holds region, endpoint and credentials (today "Settings", S9) | "Connection: us-west-2, http://localhost:8000" |
| Copy tables | The feature today called "Restore Tables" (S12), which copies tables from a source environment to the current one | "Copy tables from dev to qa with prefix remap" |
| Source tables, Target tables | The two columns on the copy page (today "Export Tables" and "Import Tables", S12) | "Source tables (dev). Target tables (current connection)." |
| List source tables | The button that lists tables available to copy (today "Explore Tables", S12) | Button: "List source tables" |
| Delete all items | The items-only truncate action (S10) | Button: "Delete all items" |
| Drop and recreate table | The table-level truncate action (S10) | Button: "Drop and recreate table" |
| Import items, Export items | JSON upload and download of items | "Import items from a JSON file (upsert)" |
| Retrieve next page | Pagination control, as today (S11) | "Retrieve next page" |

### Avoid These Terms
| Term | Reason | Alternative |
|------|--------|-------------|
| Management Console | AWS's product name; implies affiliation (S5) | DynamoDB Dashboard |
| record(s) | Not DynamoDB vocabulary; conflicts with "item" (S10) | item(s) |
| database | DynamoDB has tables, not databases (S12, API routes) | table(s) |
| Restore (for copying) | Means backup restore in AWS vocabulary (S12) | Copy tables |
| Export Tables, Import Tables (copy-page headers) | Collide with item import and export; hide direction (S12) | Source tables, Target tables |
| Explore Tables (button) | Reads as browsing; it lists source tables for a copy (S12) | List source tables |
| UPPERCASE labels (SCAN, QUERY, RUN, RESET) | Code constants leaking into UI (S11) | Scan, Query, Run, Reset |
| "has been ... successfully" | Passive filler in toasts (S12) | "Table created." |
| "Please" in instructions | Softening that adds nothing for this audience | Imperative: "Set AWS_REGION." |
| simply, just, easily, seamless, powerful, blazing | Marketing filler; none observed in product copy today, keep it that way | Delete the word |
| Dashboard (inside the UI, as a feature name) | The product is the dashboard; screens are tables, items, indexes | Name the screen |

### Never-Use Terms
| Term | Reason |
|------|--------|
| "AWS DynamoDB Dashboard", "Amazon DynamoDB Dashboard", "official" | Implies AWS ownership or endorsement. The product is independent. |
| "Management Console" anywhere in product chrome | Same reason; it is AWS's product name. |
| Superlatives about competitors ("better than Workbench", "faster than Dynobase") | Unverified; vendor-grade claims the voice does not make. |
| "secure", "safe" as bare claims | The server has no built-in authentication and binds 0.0.0.0 by default (verified in server code on 2026-10-22: no auth middleware or dependency; conflict 5). Describe the exposure instead. |

---

## Language to Avoid

No transcripts exist, so this section is derived from in-product and README copy rather than conversations. "Language That Works" is omitted for the same reason.

### Anti-Patterns
1. **"The table has been created successfully."** (S12). Problem: passive, four words of filler. Better: "Table created."
2. **"DynamoDB Management Console"** as the tab title (S5). Problem: AWS's product name on our chrome. Better: "DynamoDB Dashboard".
3. **"Scan/query a table or index"** repeated twice on one panel (S11). Problem: redundancy signals carelessness. Better: once, as the heading.
4. **"SCAN" / "QUERY" / "RUN" / "RESET"** buttons (S11). Problem: constants leaking; shouts. Better: sentence case.
5. **Raw SDK error JSON in a toast** (S4). Problem: no cause, no next step. Better: "Couldn't connect to http://localhost:8000 (ECONNREFUSED). Check that DynamoDB Local is running and AWS_ENDPOINT points to it."
6. **"Enter the partition key name"** as the Index name placeholder (S12). Problem: wrong field. Better: "Index name".
7. **"Restore Tables"** for a source-to-target copy that deletes targets (S12). Problem: wrong mental model, hides the destructive part. Better: "Copy tables" with "Target tables are dropped and recreated. This action cannot be reversed." in the dialog.
8. **"Truncate Table" next to "Drop/Create Table"** with no explanation (S10). Problem: reader cannot tell them apart; the wiring is crossed. Better: "Delete all items" and "Drop and recreate table", one sentence each on what differs.
9. **"Currently, following environment variables are supported:"** (S1). Problem: dropped article, "currently" adds nothing. Better: "Supported environment variables:"
10. **Release headline "trucate"** (S20). Problem: typo in the one line everyone reads. Better: proofread headlines; keep them in plain words.

---

## Content Examples

### Excellent Examples (existing)

**Destructive dialog pattern** (S10, S11)
Fragments as they appear today: "You are about to truncate ... table." (S10) and "This action cannot be reversed." (S11).
Why the pattern is on-brand: it names the table, states the outcome, and states irreversibility, all before the button. Keep the structure. Replace the verb and casing per the Terminology Guide; the model sentence is under Model Examples.

**CLI startup line** (S4)
> dynamodb-dashboard started at: <URL>
Why it is on-brand: one line, lowercase, the one fact you need (the URL). Example output: `dynamodb-dashboard started at: http://0.0.0.0:4567/dynamodb`.

**README install block** (adapted from S1 L14)
> Install globally:
> `npm install --global dynamodb-dashboard`
> `dynamodb-dashboard start`
Why it is on-brand: command before prose; the reader is running it within ten seconds. (The README's current label drops an article; the model keeps the structure and fixes the grammar.)

### Model Examples (proposed, not yet in the product)

**Destructive dialog**
> You are about to delete all 1,204 items in `orders`. This action cannot be reversed.
Button: "Delete all items".

**README introduction**
> # DynamoDB Dashboard
> A web GUI to browse and manage DynamoDB, local or remote.
>
> ```shell
> npm install --global dynamodb-dashboard
> dynamodb-dashboard start
> ```
> Open http://localhost:4567/dynamodb.
>
> DynamoDB Dashboard is an open-source web GUI for DynamoDB. Point it at DynamoDB Local during development or at a real AWS account, then browse tables, scan and query items, edit items as JSON, manage indexes, TTL and streams, and copy tables between environments. MIT licensed. Not affiliated with Amazon Web Services.

**Release note** (placeholders; do not reuse the example facts)
> ## X.Y.Z
> - <User-visible change, one sentence, plain words. State any data effect.>
> - Fixed: <verified fix, one sentence>.
> - Breaking: none.

**Issue reply** (placeholders in angle brackets)
> Thanks for the report. Reproduced with `AWS_PROFILE` and a mounted `~/.aws`. <Root cause in one sentence.> Fix is in #<PR> and ships in <version>. Until then, set `AWS_REGION` explicitly.
(The workaround line reflects the maintainer's confirmed answer in #1899, S21; the rest is placeholder.)

**Error toast**
> Couldn't connect to http://localhost:8000 (ECONNREFUSED). Check that DynamoDB Local is running and AWS_ENDPOINT points to it.

### Examples to Avoid

**Tab title** (S5)
> DynamoDB Management Console
Off-brand: AWS's product name, and the product's own name is absent from the UI. Fix: "DynamoDB Dashboard".

**Success toast** (S12)
> The table has been created successfully.
Off-brand: passive and padded. Fix: "Table created."

**Imagined launch post (illustrative; do not write this)**
> Excited to announce DynamoDB Dashboard, the most powerful and seamless way to manage your DynamoDB data! 🚀
Off-brand: superlatives, exclamation, no mechanics, no command. Fix: see the community-post example in the tone matrix.

---

## Visual Identity Notes [applied Q7]

Brief, because this is a voice guide. Full visual guidance is out of scope.
- **Logo**: two overlapping "D" shapes, rear #76c0e5 (light sky blue), front #7393f7 (periwinkle). SVG at `app/src/assets/logo.svg`; favicon matches (S7, S8). The SVG is not used in the app today.
- **Accent**: adopt the logo blues as named tokens for primary actions and links, replacing stock Bootstrap #0d6efd and the editor's #3b82f6 (S6, S13). Keep red for destructive actions and green for success.
- **Shape**: square corners (`rounded-0`) everywhere is the existing signature. Keep it.
- **Type**: Roboto 14px base for UI, JetBrains Mono in the JSON editor (S6, S13).
- **Themes**: dark mode is a runtime filter and the editor is always dark (issue #2164). Deferred; not a voice matter.
- **Confidence**: Medium for the facts, Low for the token proposal. Not part of the aggregate score.

---

## Confidence Scores

| Section | Confidence | Basis | Sources |
|---------|------------|-------|---------|
| Voice Attributes | Medium | Six attributes: four Medium, two Low; section takes the majority rating. Consistent patterns across README, CLI, UI and issues, but inferred; no written guidance; one unresolved conflict (three registers) | 8 (S1, S3, S4, S9 to S12, S21) |
| Messaging Framework | Low | Only a tagline is documented; pillars and positioning are proposals built on the feature inventory | 6 (S1, S2, S15, S19, S22, S23) plus S26 |
| Tone Matrix | Medium | Three or more examples for README, UI, dialogs, CLI and release notes; error, issue-reply and community contexts extrapolated | 10 |
| Terminology | Medium | Terms used consistently in practice; renames are proposals | 6 (S1, S3, S9 to S12) |
| Language Patterns | Low | No transcripts; anti-patterns drawn from in-product copy only | 5 |
| Brand Personality | Medium | Interpretation of the attributes above; excluded from the aggregate | derived |
| Visual Identity Notes | Medium / Low | Facts observed; token proposal untested; excluded from the aggregate | 4 (S6, S7, S8, S13) |
| **Aggregate** | **Low (0.50)** | 0.6×0.30 + 0.3×0.25 + 0.6×0.20 + 0.6×0.15 + 0.3×0.10 = 0.495. Bands: 0.85 to 1.0 High, 0.60 to 0.84 Medium, below 0.60 Low | |

What would raise it: confidence follows evidence. Once the owner confirms items 1 to 3 and adopts this document, it becomes the authoritative source, which satisfies the "explicit guidance" criterion for Voice and Messaging (each to Medium-High). Writing and reviewing three real error messages and three hand-written release notes in this voice adds observed examples (Tone to High). Adopting the terminology renames in the UI makes the glossary observed rather than proposed (Terminology to High).

---

## Open Questions for Team Discussion

Numbering: items are listed 1 to 10 below. Tags such as [applied Q4] use the discovery report's question numbers (report Q1 to Q8). Items 6 and 9 are new to this draft; item 10 is report Q8. Items 1 to 9 are applied in the body; item 10 needs owner action.

### High Priority (blocks guideline completion)
1. **Product name and tab title** [applied Q1]
   - What was found: README says "DynamoDB Dashboard"; tab says "DynamoDB Management Console"; breadcrumb says "DynamoDB"; "Dashboard" appears nowhere in app strings (S5, S9).
   - Agent recommendation: "DynamoDB Dashboard" everywhere a human reads; `dynamodb-dashboard` for identifiers; remove "Management Console".
   - Need from you: confirm, or give the name you want in the chrome.

2. **Scope: upstream or your fork** [applied Q2]
   - What was found: upstream maintainer controls npm, Docker Hub, README and the tab title. Your fork is current with upstream and carries no distinct name.
   - Agent recommendation: treat these guidelines as the voice for the product as published upstream, and apply them through PRs (issue #1826 is the natural vehicle). If the fork will ship under its own name, say so and the name sections change.
   - Need from you: upstream proposals, or an independently named fork.

3. **Voice register** [applied Q3]
   - What was found: three registers coexist: telegraphic README, formal AWS-like UI, warm maintainer replies (conflict 12).
   - Agent recommendation: direct, plain and technically precise everywhere; warmth reserved for issue and discussion replies.
   - Need from you: confirm, or say if the UI should be warmer or the README more polished.

9. **Network-exposure statement** [applied, new]
   - What was found: the server binds 0.0.0.0 by default (S3) and has no built-in authentication (verified in server code on 2026-10-22: no auth middleware or dependency); credentials are typed into plain-text fields (report section 6). README says 127.0.0.1 (conflict 5). This matters because the UI accepts credentials.
   - Agent recommendation: a short, candid README note: "By default the server listens on 0.0.0.0 and has no built-in authentication. Run it on localhost or behind a reverse proxy with authentication. Do not expose it to the public internet." Matches the "candid about consequences" attribute. Applied as a README rule in the tone matrix.
   - Need from you: approve the note, or decide to change the default host first.

### Medium Priority (improves quality)
4. **Hero promise and the verb** [applied Q4, revised]
   - What was found: the audience brief and the discovery report's recommendation both say "run and manage"; the tool does not start DynamoDB, the compose file does (S15).
   - Agent recommendation: this draft revises the report's recommendation to "browse and manage", one promise covering local and remote, local-dev as the first example. Revert to "run and manage" if you read "run" as "operate".
   - Need from you: accept "browse and manage", or supply the verb you prefer.

5. **AWS-derived help text and non-affiliation** [applied Q6]
   - What was found: table, TTL and stream help text reads like AWS console wording (S12, inference); no non-affiliation note anywhere.
   - Agent recommendation: rewrite help text in this voice; add "Not affiliated with Amazon Web Services." to the README intro, GitHub About and Docker Hub full description. This is not legal advice; a trademark note may also be wise.
   - Need from you: confirm the rewrite and the line.

6. **Terminology renames in the UI** [applied, new]
   - What was found: "Restore Tables" is a destructive copy; "Settings" is the connection dialog; Truncate and Drop/Create sit side by side unexplained and are wired crosswise; the copy page uses "Export Tables", "Import Tables" and "Explore Tables" (S10, S12).
   - Agent recommendation: "Copy tables", "Connection", "Delete all items", "Drop and recreate table", "Source tables", "Target tables", "List source tables". Applied in the Preferred Terms table.
   - Need from you: approve the names, or edit them.

7. **Visual accent** [applied Q7]
   - What was found: logo blues unused; three different blues in the UI (S6, S7, S13).
   - Agent recommendation: logo blues as tokens, keep square corners, defer the dark theme.
   - Need from you: confirm, or keep stock Bootstrap blue.

### Low Priority (nice to have)
8. **Competitor naming** [applied Q5]
   - What was found: no competitor is named in the README, tagline or registry copy. The GitHub topic and the forum slug name dynamodb-admin as lineage (S19, S24). The only landscape data is one web search (S26).
   - Agent recommendation: stay neutral in the tagline; publish comparisons only after verifying each claim.
   - Need from you: confirm, or name the comparison you want made.

10. **Google Drive** [report Q8, not applied]
   - What was found: the Drive connector needs sign-in; nothing could be searched.
   - Agent recommendation: sign in via Connectors if any brand or positioning material lives there, then rerun discovery; otherwise mark Drive as empty.
   - Need from you: sign in, or confirm there is nothing there.

---

## Data Gaps & Recommendations

- [ ] No authoritative brand source: adopt this document as v1 after answering items 1 to 3, then it becomes the authoritative source.
- [ ] No feature list in README, npm or Docker Hub: add the "Manage as well as browse" pillar as a bullet list.
- [ ] No real error copy: write three error messages in this voice (connection refused, bad credentials, table not found) and review them.
- [ ] Release notes are auto-generated: write the next release note by hand using the model example; keep "Breaking:" as a fixed line.
- [ ] README omits `--prefix` and states the wrong default host (conflicts 5 and 6): fix when the README intro is rewritten.
- [ ] UI copy bugs (conflict 10): index-name placeholder, Boolean offered as an index key type, credential label casing, singular/plural mismatch in the delete dialog.
- [ ] Version drift (conflict 15): root package.json says 1.0.0 under the published package name; align or mark private.
- [ ] GitHub Discussions and the LocalStack thread were unreadable: skim them once for user vocabulary.
- [ ] Google Drive unsearched: see item 10.
- [ ] Competitor facts unverified: verify Workbench, dynamodb-admin and the AWS console claim before any comparison copy.
- [ ] README screenshots may predate the current UI: recapture after the tab title and terminology changes.

---

## Appendix: Sources

| # | Source | Platform | Type | Date | Key Sections Used | Confidence |
|---|--------|----------|------|------|-------------------|------------|
| S1 | README.md | Local repo | OPERATIONAL | 2026-01-15 | Messaging, Tone (README), Terminology, Examples | High |
| S2 | server/package.json | Local repo | OPERATIONAL | 2026-10-06 | Messaging (tagline variants) | High |
| S3 | server/src/bin/cli.js | Local repo | OPERATIONAL | 2024-11-30 | Voice (Direct), Tone (CLI), network exposure | High |
| S4 | server/src/bin/server.js; server/src/errors/handler.js | Local repo | OPERATIONAL | 2026-03-01; 2023-10-11 | Tone (CLI, Errors), Anti-patterns | High |
| S5 | app/index.html | Local repo | OPERATIONAL | 2022-09-08 | Name conflict, Never-use | High |
| S6 | app/src/App.vue; app/src/assets/main.css | Local repo | OPERATIONAL | 2026-10-06; 2026-08-21 | Visual notes | High |
| S7 | app/src/assets/logo.svg | Local repo | CONTEXTUAL | 2025-08-09 | Visual notes | High |
| S8 | app/public/favicon.ico | Local repo | CONTEXTUAL | 2025-08-08 | Visual notes | Med |
| S9 | bread-crumb.vue; SearchDropdown.vue | Local repo | OPERATIONAL | 2025-06-09 | Terminology (Connection), Messaging pillar 2 | High |
| S10 | app/src/views/items/HomeTable.vue | Local repo | OPERATIONAL | 2026-10-06 | Voice (Candid), Terminology, Anti-patterns | High |
| S11 | app/src/components/app/* | Local repo | OPERATIONAL | 2025 to 2026 | Voice (Candid, Precise), Tone (UI), Examples | High |
| S12 | app/src/views/table/* | Local repo | OPERATIONAL | 2023 to 2026 | Voice (Engineer-to-engineer), Terminology, Anti-patterns | High |
| S13 | CreateItem.vue; EditItem.vue; codeMirrorConfig.ts | Local repo | OPERATIONAL | 2025 to 2026 | Visual notes, Feature pillar 3 | High |
| S15 | Dockerfile; docker-compose*.yml; Makefile; workflows | Local repo | OPERATIONAL | 2024 to 2026 | Messaging pillars 1 and 4, Q4 revision | High |
| S16 | LICENSE; PR and issue templates | Local repo | OPERATIONAL | 2022 | Messaging pillar 4, Independent attribute | High |
| S18 | Git history | Local repo | OPERATIONAL | 2022 to 2026 | Tagline change, lineage | High |
| S19 | GitHub repo page and API | GitHub | OPERATIONAL | 2026-10-22 | Tagline variants, topics, pillar 1, Independent attribute | High |
| S20 | GitHub releases v1.25.8 to v1.26.1 | GitHub | OPERATIONAL | 2026-10-06 | Tone (Release notes), Anti-patterns | High |
| S21 | GitHub issues #1437, #1655, #1826, #1899 | GitHub | CONVERSATIONAL | 2025 to 2026 | Voice (Accountable), Tone (Issue replies) | Med |
| S22 | npm registry metadata | npm | OPERATIONAL | 2026-10-22 | Tagline variants, channels | High |
| S23 | Docker Hub listing | Docker Hub | OPERATIONAL | 2026-10-22 | Tagline variants, channels | Med |
| S24 | LocalStack forum thread (URL slug only) | Web | CONVERSATIONAL | unknown | Lineage, Independent attribute | Low |
| S25 | README mirrors on unpkg and jsDelivr | Web | STALE | n/a | Registry rule on stale mirrors only (conflict 16) | n/a |
| S26 | Landscape web search summary | Web | CONTEXTUAL | 2026-10-22 | Competitive positioning | Low |

Not used: S14 (app manifest, stack only), S17 (stale sub-READMEs).
