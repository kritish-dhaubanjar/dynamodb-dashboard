const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");
const EXEC = "/Users/leapfrog/.cache/puppeteer/chrome-headless-shell/mac_arm-127.0.6533.72/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const BASE = "http://127.0.0.1:4567/dynamodb";
const OUT = path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });
const shots = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: EXEC, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
  const page = await browser.newPage();
  if (process.env.DIAG) { page.on("request", (r) => { const u = r.url(); if (!/fonts|\.(png|js|css|ico|woff2?)(\?|$)/.test(u)) console.log("REQ", r.method(), u.replace("http://127.0.0.1:4567", "")); }); page.on("framenavigated", (f) => { if (f === page.mainFrame()) console.log("NAV", f.url().replace("http://127.0.0.1:4567", "")); }); page.on("console", (m) => { if (["error", "warning"].includes(m.type())) console.log("CONSOLE", m.type(), m.text().slice(0, 160)); }); page.on("response", async (r) => { if (r.url().includes("/api/database")) { let t = ""; try { t = await r.text(); } catch (e) {} console.log("RESP", r.status(), t.slice(0, 400)); } }); page.on("request", (r) => { if (r.method() === "POST" && r.url().includes("/api/database")) console.log("POSTDATA", (r.postData() || "").slice(0, 300)); }); page.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 160))); }
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
  for (const s of shots) {
    try {
      await page.goto(BASE + s.path, { waitUntil: "networkidle0", timeout: 60000 });
      await sleep(s.wait ?? 1500);
      for (const step of s.steps || []) {
        if (step.click) { await page.click(step.click); }
        if (step.type) { await page.type(step.type.sel, step.type.text, { delay: 20 }); }
        if (step.eval) { await page.evaluate(step.eval); }
        if (step.press) { await page.keyboard.press(step.press); }
        if (step.clickText) { const h = await page.evaluateHandle((txt) => [...document.querySelectorAll("button")].find((b) => b.textContent.includes(txt) && b.offsetParent !== null), step.clickText); const el = h.asElement(); if (!el) throw new Error("no visible button " + step.clickText); await el.click(); }
        if (step.log) { console.log("LOG", step.log.slice(0,40), "=>", JSON.stringify(await page.evaluate(step.log))); }
        await sleep(step.wait ?? 1000);
      }
      await page.screenshot({ path: path.join(OUT, s.name + ".png"), fullPage: !!s.full });
      console.log("shot", s.name, "->", page.url());
    } catch (e) { console.log("FAIL", s.name, e.message.split("\n")[0]); }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
