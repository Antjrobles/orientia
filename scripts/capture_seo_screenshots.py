"""
Visual SEO screenshot capture script for orientia.es
Captures desktop and mobile viewports with detailed DOM analysis.
"""

import json
import os
from playwright.sync_api import sync_playwright

URL = "https://orientia.es"
OUTPUT_DIR = "C:/Users/arobl/Documents/Github/orientia/screenshots"

os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = {
    "desktop_1280x800": {"width": 1280, "height": 800},
    "mobile_390x844": {"width": 390, "height": 844},
}


def capture(page, name, viewport):
    page.set_viewport_size(viewport)
    page.goto(URL, wait_until="networkidle", timeout=30000)
    # Let any animations settle
    page.wait_for_timeout(2000)
    path = f"{OUTPUT_DIR}/{name}.png"
    page.screenshot(path=path, full_page=False)
    print(f"Saved: {path}")
    return path


def extract_seo_signals(page):
    signals = page.evaluate("""() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // H1 analysis
        const h1s = Array.from(document.querySelectorAll('h1'));
        const h1Info = h1s.map(el => {
            const r = el.getBoundingClientRect();
            return {
                text: el.innerText.trim().slice(0, 120),
                visible_above_fold: r.top >= 0 && r.bottom <= vh,
                top: Math.round(r.top),
                bottom: Math.round(r.bottom),
                fontSize: window.getComputedStyle(el).fontSize,
            };
        });

        // CTA buttons / primary actions
        const ctaSelectors = [
            'a[href*="register"], a[href*="signup"], a[href*="login"], a[href*="empezar"]',
            'button[type="submit"], button.cta, a.cta',
            'a.btn, button.btn',
            'nav a', 'header a',
        ];
        const ctaElements = [];
        ctaSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                    ctaElements.push({
                        tag: el.tagName,
                        text: el.innerText.trim().slice(0, 60),
                        href: el.href || null,
                        above_fold: r.top >= 0 && r.bottom <= vh,
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        top: Math.round(r.top),
                    });
                }
            });
        });

        // Logo
        const logoSelectors = ['img[alt*="logo" i], img[src*="logo" i], header img, nav img, a[href="/"] img'];
        const logos = [];
        logoSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.width > 0) {
                    logos.push({
                        src: el.src,
                        alt: el.alt,
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        above_fold: r.top >= 0 && r.bottom <= vh,
                        top: Math.round(r.top),
                    });
                }
            });
        });

        // LCP candidate — largest visible image or text block above fold
        const allImgs = Array.from(document.querySelectorAll('img, [style*="background-image"]'));
        const imgCandidates = allImgs
            .map(el => {
                const r = el.getBoundingClientRect();
                return {
                    tag: el.tagName,
                    src: el.src || 'background',
                    area: r.width * r.height,
                    above_fold: r.top >= 0 && r.bottom <= vh && r.width > 0,
                    width: Math.round(r.width),
                    height: Math.round(r.height),
                    top: Math.round(r.top),
                };
            })
            .filter(c => c.above_fold)
            .sort((a, b) => b.area - a.area)
            .slice(0, 3);

        // Horizontal scroll check
        const hasHorizontalScroll = document.documentElement.scrollWidth > vw;

        // Nav visibility
        const nav = document.querySelector('nav, header nav, [role="navigation"]');
        let navInfo = null;
        if (nav) {
            const r = nav.getBoundingClientRect();
            navInfo = {
                visible: r.width > 0 && r.height > 0,
                height: Math.round(r.height),
                above_fold: r.top >= 0 && r.bottom <= vh,
            };
        }

        // Trust signals
        const trustPatterns = ['testimonial', 'review', 'rating', 'star', 'trust', 'seguro', 'privacidad'];
        const trustElements = [];
        trustPatterns.forEach(pat => {
            document.querySelectorAll(`[class*="${pat}"], [id*="${pat}"]`).forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top >= 0 && r.bottom <= vh && r.width > 0) {
                    trustElements.push({ class: el.className.slice(0, 60), top: Math.round(r.top) });
                }
            });
        });

        // Font sizes for readability
        const bodyFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);

        return {
            viewport: { width: vw, height: vh },
            h1: h1Info,
            cta_elements: ctaElements.slice(0, 10),
            logos: logos.slice(0, 3),
            lcp_candidates: imgCandidates,
            has_horizontal_scroll: hasHorizontalScroll,
            nav: navInfo,
            trust_elements: trustElements.slice(0, 5),
            body_font_size_px: bodyFontSize,
            page_title: document.title,
            meta_description: (document.querySelector('meta[name="description"]') || {}).content || null,
        };
    }""")
    return signals


def main():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for name, viewport in VIEWPORTS.items():
            print(f"\n--- Capturing {name} ---")
            context = browser.new_context(
                viewport=viewport,
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
                if "desktop" in name
                else "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
            )
            page = context.new_page()
            path = capture(page, name, viewport)
            signals = extract_seo_signals(page)
            signals["screenshot_path"] = path
            results[name] = signals
            context.close()

        browser.close()

    # Save JSON report
    report_path = f"{OUTPUT_DIR}/seo_signals.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nSEO signals saved to: {report_path}")
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
