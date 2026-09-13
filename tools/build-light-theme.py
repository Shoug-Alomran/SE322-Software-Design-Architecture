#!/usr/bin/env python3
"""Generate light-mode overrides for the Tailwind colour classes used by the site.

The pages are designed dark-first with hard-coded Tailwind colours
(text-slate-400, bg-[#030712]/90, border-cyan-500/20, ...). This script scans
every page plus assets/js/site.js, finds those colour utilities (including
hover:, group-hover: and ! variants) and writes matching `html.light ...`
rules into the generated block at the end of site/assets/css/site.css.

Run it again after adding new colour classes:
    python3 tools/build-light-theme.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
CSS = ROOT / "assets" / "css" / "site.css"
START = "/* === light-mode:generated start (tools/build-light-theme.py) === */"
END = "/* === light-mode:generated end === */"

CYAN = (8, 145, 178)       # cyan-600
CYAN_TEXT = (14, 116, 144)  # cyan-700
INK = (15, 23, 42)          # slate-900
LINE = (203, 213, 225)      # slate-300

TOKEN = re.compile(
    r"^(?P<imp1>!)?"
    r"(?P<variant>hover|group-hover(?:/[a-z]+)?|group-focus-within|placeholder)?:?"
    r"(?P<imp2>!)?"
    r"(?P<prop>bg|text|border-l|border|from|to)-"
    r"(?P<color>white|\[#[0-9a-f]{6}\]|(?:navy|slate|cyan|yellow)-\d{2,3})"
    r"(?:/(?P<alpha>\d+|\[0?\.\d+\]))?$"
)


def rgba(rgb, a=1.0):
    if a >= 1:
        return "#%02x%02x%02x" % rgb
    return "rgba(%d, %d, %d, %s)" % (*rgb, ("%.3f" % a).rstrip("0").rstrip("."))


def shade(color):
    m = re.search(r"-(\d+)$", color)
    return int(m.group(1)) if m else 0


def light_value(prop, color, a):
    family = color.split("-")[0]
    n = shade(color)
    dark_bg = color in ("[#030712]", "[#060b13]") or (family == "navy" and n >= 800)

    if prop == "text":
        if color == "white" or (family == "slate" and n <= 200):
            return rgba(INK, a)
        if family == "slate":
            return rgba({300: (30, 41, 59), 400: (71, 85, 105), 500: (100, 116, 139)}.get(n, (148, 163, 184)), a)
        if family == "cyan":
            return rgba(CYAN if n == 500 else CYAN_TEXT, a)
        if family == "navy":
            return rgba((255, 255, 255), a)
        if family == "yellow":
            return rgba((161, 98, 7), a)
        return None

    if prop == "bg":
        if dark_bg:
            return rgba((255, 255, 255), max(a, 0.4))
        if color == "white":
            return rgba(INK, a * 1.5)
        if family == "navy":
            return rgba(LINE, a)
        if family == "slate":
            return rgba((241, 245, 249), min(1.0, a * 3)) if n >= 800 else rgba((148, 163, 184), a)
        if family == "cyan":
            return rgba(CYAN, 0.04 + 0.1 * a) if n >= 900 else rgba(CYAN, a)
        if family == "yellow":
            return rgba((202, 138, 4), a)
        return None

    if prop in ("border", "border-l"):
        if family == "cyan":
            if n >= 800:
                return rgba(CYAN, 0.15 + 0.15 * a)
            return rgba(CYAN, 1.0 if a >= 1 else min(1.0, 0.12 + 0.6 * a))
        if family in ("navy", "slate"):
            return rgba(LINE, a) if n >= 600 or family == "navy" else rgba((148, 163, 184), a)
        if family == "yellow":
            return rgba((202, 138, 4), a)
        return None

    if prop in ("from", "to"):
        if color == "white":
            return rgba(INK, a)
        if family == "slate":
            return rgba((100, 116, 139), a)
        if dark_bg:
            return rgba((245, 248, 251), a)
        return None  # cyan gradients read fine on light backgrounds
    return None


CSS_PROP = {
    "text": "color",
    "bg": "background-color",
    "border": "border-color",
    "border-l": "border-left-color",
    "from": "--tw-gradient-from",
    "to": "--tw-gradient-to",
}


def css_escape(cls):
    return re.sub(r"([^a-zA-Z0-9_-])", r"\\\1", cls)


def selector(token, variant):
    cls = "." + css_escape(token)
    if not variant:
        return "html.light " + cls
    if variant == "hover":
        return "html.light %s:hover" % cls
    if variant == "placeholder":
        return "html.light %s::placeholder" % cls
    if variant == "group-focus-within":
        return "html.light .group:focus-within " + cls
    group = variant.split("/", 1)
    group_cls = ".group" + ("\\/" + group[1] if len(group) > 1 else "")
    return "html.light %s:hover %s" % (group_cls, cls)


def main():
    sources = sorted(ROOT.glob("*.html")) + [ROOT / "assets" / "js" / "site.js"]
    tokens = set()
    for path in sources:
        tokens.update(re.split(r"[\s\"'<>=+`]+", path.read_text(encoding="utf-8")))

    base, variants = [], []
    for token in sorted(tokens):
        m = TOKEN.match(token)
        if not m:
            continue
        alpha = m.group("alpha")
        a = 1.0 if alpha is None else float(alpha.strip("[]")) if alpha.startswith("[") else int(alpha) / 100
        value = light_value(m.group("prop"), m.group("color"), a)
        if value is None:
            continue
        important = " !important" if (m.group("imp1") or m.group("imp2")) else ""
        prop = CSS_PROP[m.group("prop")]
        if prop.startswith("--tw-gradient"):
            value += " var(%s-position)" % prop
        rule = "%s { %s: %s%s; }" % (selector(token, m.group("variant")), prop, value, important)
        (variants if m.group("variant") else base).append(rule)

    block = "\n".join([START] + base + variants + [END])
    css = CSS.read_text(encoding="utf-8")
    if START in css:
        css = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, css, flags=re.S)
    else:
        css = css.rstrip() + "\n\n" + block + "\n"
    CSS.write_text(css, encoding="utf-8")
    print("wrote %d light-mode rules to %s" % (len(base) + len(variants), CSS.relative_to(ROOT.parent)))


if __name__ == "__main__":
    main()
