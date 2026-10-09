from playwright.sync_api import sync_playwright

def run_test(page):
    page.goto("http://localhost:8080/index.html")
    page.wait_for_timeout(1000)

    # Verify dynamic content loaded
    print("Checking featured game title...")
    title = page.locator(".featured-content h1").inner_text()
    if title == "Cyber Samurai: Neo Edo":
        print("Success: Featured game loaded from JSON.")
    else:
        print(f"Error: Featured game title is '{title}'")

    print("Checking game cards...")
    cards_count = page.locator(".game-card").count()
    if cards_count == 4:
        print("Success: 4 game cards loaded.")
    else:
        print(f"Error: Expected 4 cards, found {cards_count}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_test(page)
        finally:
            browser.close()
