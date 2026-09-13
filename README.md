# SE322-Software-Design-Architecture

[![Deploy to GitHub Pages](https://github.com/Shoug-Alomran/SE322-Software-Design-Architecture/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shoug-Alomran/SE322-Software-Design-Architecture/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/live-site-00f0ff?style=flat&logo=github&logoColor=white&labelColor=030712)](https://software-architecture.shoug-tech.com/)

SE322 Software Design &amp; Architecture project — documenting the system architecture, 4+1 views, quality attributes, architectural styles, design patterns, and validation.

## Site map

Home → Project Overview → Architecture Overview → 4+1 Views (User, Logical, Process, Development, Physical) → Quality Attributes → Architectural Style → Design Patterns → Documentation & Validation

| Page | File |
| --- | --- |
| Home | `site/index.html` |
| Project Overview | `site/project.html` |
| Architecture Overview | `site/architecture.html` |
| User View (+1) | `site/user-view.html` |
| Logical View | `site/logical-view.html` |
| Process View | `site/process-view.html` |
| Development View | `site/development-view.html` |
| Physical View | `site/physical-view.html` |
| Quality Attributes | `site/quality.html` |
| Architectural Style | `site/architectural-style.html` |
| Design Patterns | `site/design-patterns.html` |
| Documentation & Validation | `site/documentation.html` |

## Project structure

```
site/
├── *.html                    # one file per page
└── assets/
    ├── css/site.css          # shared blueprint styles (panels, crosshairs, diagram slots)
    ├── js/site.js            # shared header, 4+1 view tabs, prev/next pager, footer
    ├── js/tailwind-config.js # shared Tailwind theme
    ├── diagrams/             # put UML diagram images here
    └── documents/            # put deliverable PDFs here
```

The navigation bar, footer and the Previous / Next buttons are generated from the `PAGES` list in `site/assets/js/site.js`, so page order and titles only need to be changed in that one place.

## Editing content

- **Text** — replace any `[Placeholder]` text directly in the HTML page.
- **Diagrams** — save the image to `site/assets/diagrams/` and replace the `diagram-placeholder` block with the `<img>` tag shown in the HTML comment right above it. Clicking a diagram image opens it full screen.
- **Documents** — save PDFs to `site/assets/documents/` using the file names referenced in `documentation.html` (`software-architecture-document.pdf`, `architecture-documentation.pdf`, `software-design-document.pdf`, `final-presentation.pdf`).

## Preview locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment (GitHub Actions)

`.github/workflows/deploy.yml` checks internal links and publishes the `site/` folder to GitHub Pages.

- Runs automatically on every push to `main`.
- Run it manually from **Actions → Deploy to GitHub Pages → Run workflow**.

**One-time setup:**

1. In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
2. In **Settings → Pages → Custom domain** enter `software-architecture.shoug-tech.com`, save, then tick **Enforce HTTPS** once the certificate is issued.
3. At your DNS provider for `shoug-tech.com`, add a `CNAME` record: `software-architecture` → `shoug-alomran.github.io`.

The site is served at **https://software-architecture.shoug-tech.com/**. `site/CNAME`, `site/robots.txt` and `site/sitemap.xml` are published with it — add a `<url>` entry to the sitemap whenever a new page is created.
