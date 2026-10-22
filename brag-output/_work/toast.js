const puppeteer = require("puppeteer-core");
const EXEC = "/Users/leapfrog/.cache/puppeteer/chrome-headless-shell/mac_arm-127.0.6533.72/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: EXEC, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
  p.on("response", (r) => { if (r.url().includes("/api/")) console.log("api", r.request().method(), r.status(), r.url().replace(/^.*\/api/, "/api")); });
  await p.goto("http://127.0.0.1:4567/dynamodb/orders/edit-item?orderId=ord_7f387cf3", { waitUntil: "networkidle0" });
  await sleep(1500);
  console.log("buttons:", await p.evaluate(() => [...document.querySelectorAll("button")].map((b) => JSON.stringify(b.textContent.trim()) + (b.disabled ? "[disabled]" : "")).join(", ")));
  // double-click the word "pending" on line 19 and replace it, so the editor content changes
  await p.mouse.click(232, 489, { clickCount: 2 });
  await sleep(200);
  await p.keyboard.type("paid", { delay: 40 });
  await sleep(500);
  console.log("after edit:", await p.evaluate(() => [...document.querySelectorAll("button")].map((b) => JSON.stringify(b.textContent.trim()) + (b.disabled ? "[disabled]" : "")).join(", ")));
  const btn = await p.evaluateHandle(() => [...document.querySelectorAll("button")].find((b) => /Save/i.test(b.textContent)));
  await btn.click();
  for (const [i, ms] of [[1, 250], [2, 250], [3, 400]]) {
    await sleep(ms);
    const t = await p.evaluate(() => { const e = document.querySelector(".toast"); return e ? e.className + " | " + getComputedStyle(e).opacity + " | " + e.textContent.trim() : "no toast"; });
    console.log("toast", i, t);
    await p.screenshot({ path: `out/save-toast-${i}.png` });
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
