#!/usr/bin/env python3
"""Export the slide deck (site/presentation.html) to a light-mode PDF.

Writes site/assets/documents/final-presentation.pdf, the file behind the
"Download PDF" button on the Documentation page. Each slide becomes one
16:9 page; tabbed slides (scenarios, quality attribute scenarios, prototype
screens) get one page per tab.

Run it again after changing the deck:
    python3 tools/build-presentation-pdf.py

Needs Playwright for Python with Chromium:
    pip install playwright && playwright install chromium
"""
import functools
import http.server
import pathlib
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
OUT = ROOT / "assets" / "documents" / "final-presentation.pdf"

# Every tab of a tabbed slide becomes its own slide, so nothing is hidden in
# print. Lazy images are loaded up front because print does not scroll.
PREPARE = """
() => {
  document.documentElement.setAttribute("data-theme", "light");
  document.querySelectorAll("img[loading=lazy]").forEach((img) => img.removeAttribute("loading"));
  document.querySelectorAll(".slide[data-steps]").forEach((slide) => {
    const steps = +slide.dataset.steps;
    let after = slide;
    for (let k = 0; k < steps; k++) {
      const copy = k === 0 ? slide : slide.cloneNode(true);
      copy.querySelectorAll(".step-panel").forEach((p, i) => p.classList.toggle("on", i === k));
      copy.querySelectorAll(".step-tab").forEach((t, i) => t.classList.toggle("on", i === k));
      if (k > 0) {
        copy.removeAttribute("id");
        after.after(copy);
        after = copy;
      }
    }
  });
  return Promise.all([
    document.fonts.ready,
    ...[...document.images].map((img) =>
      img.complete ? null : new Promise((done) => (img.onload = img.onerror = done)),
    ),
  ]).then(() => document.querySelectorAll(".slide").length);
}
"""


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT))
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_address[1]}/presentation.html"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(
                viewport={"width": 1600, "height": 900}, color_scheme="light"
            )
            page.goto(url, wait_until="networkidle")
            pages = page.evaluate(PREPARE)
            page.pdf(
                path=str(OUT),
                prefer_css_page_size=True,
                print_background=True,
            )
            browser.close()
    finally:
        server.shutdown()
    print(f"wrote {pages} pages to {OUT.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
