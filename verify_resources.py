from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(1000)

    # Click the Zasoby tab
    page.get_by_role("link", name="Zasoby").click()
    page.wait_for_timeout(1000)

    # Take screenshot of the empty state in the Zasoby tab
    page.screenshot(path="/home/jules/verification/screenshots/verification_resources.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
