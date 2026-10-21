import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/equipe");
await page.getByRole("button", { name: "Entrar na demonstração" }).click();
console.log(
  JSON.stringify(
    await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("body *")]
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          x: el.getBoundingClientRect().x,
          right: el.getBoundingClientRect().right,
          width: el.getBoundingClientRect().width,
          scroll: el.scrollWidth,
        }))
        .filter((el) => el.right > innerWidth + 1)
        .slice(0, 40),
    })),
    null,
    2,
  ),
);
await browser.close();
