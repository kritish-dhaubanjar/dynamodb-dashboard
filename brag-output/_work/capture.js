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
        await sleep(step.wait ?? 1000);
      }
      await page.screenshot({ path: path.join(OUT, s.name + ".png"), fullPage: !!s.full });
      console.log("shot", s.name, "->", page.url());
    } catch (e) { console.log("FAIL", s.name, e.message.split("\n")[0]); }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
