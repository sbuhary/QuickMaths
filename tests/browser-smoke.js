const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

async function main() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.log("Playwright is not installed; skipping optional browser smoke test.");
    process.exit(0);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const fileUrl = pathToFileURL(path.resolve("index.html")).href;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(fileUrl);
  await page.getByRole("button", { name: /Start stage 1/i }).click();
  await page.getByRole("button", { name: /Change timer style/i }).click();
  await page.getByRole("button", { name: /Mute sounds/i }).click();
  await page.getByRole("button", { name: /Pencil and colors/i }).click();
  await page.getByRole("button", { name: /Medium pen/i }).click();

  const canvas = await page.locator("#board").boundingBox();
  if (!canvas) throw new Error("Canvas not visible");
  await page.mouse.move(canvas.x + 80, canvas.y + 420);
  await page.mouse.down();
  await page.mouse.move(canvas.x + 130, canvas.y + 450);
  await page.mouse.up();
  await page.getByRole("button", { name: /Clear answer/i }).click();

  if (errors.length) throw new Error(errors.join("\n"));
  await browser.close();
  console.log("QuickMaths browser smoke checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
