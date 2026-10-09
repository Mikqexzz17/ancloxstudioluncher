import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        await page.goto("http://localhost:8080")

        # Wait for the logo image to be visible
        await page.wait_for_selector(".logo-image")

        # Save screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/verification_logo.png")
        await browser.close()

asyncio.run(main())
