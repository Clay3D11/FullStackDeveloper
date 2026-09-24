# Clainer Ventura: Full-Stack Developer Portfolio

**Live site:** [clainerdev.com](https://clainerdev.com)

This is the personal portfolio of **Clainer Ventura**, a full-stack software developer based in New York.
It showcases my projects, skills, experience, and resume, and includes a working contact form.

The site is built with **vanilla HTML, CSS, and JavaScript**. It uses no frameworks, has no build step, and is hosted on **GitHub Pages** with a custom domain.

## Features

- **Dark, responsive design** that works on phones, tablets, and desktops
- **Project showcase**: live links to each project, with expandable details and tech tags
- **Bio and resume popups**: open, close, and Escape-key handling are written in plain JavaScript
- **Downloadable resume** (`resume.pdf`)
- **Contact form**: sends messages through the [Web3Forms](https://web3forms.com) API with `fetch`, shows loading, success, and error states, and includes a spam honeypot
- **Scroll animations** built on `IntersectionObserver`, which turn off automatically when the visitor prefers reduced motion
- **Animated tech-stack strip** made with CSS keyframes and container query units
- **Accessibility**: keyboard focus styles, ARIA attributes on menus, toggles, and dialogs, and a mobile menu

## Featured projects

| Project | Description | Live |
|---|---|---|
| Universal Limitless | Company platform with a project cart and inquiry forms | [universallimitless.com](https://universallimitless.com/) |
| Limitless POS | Point-of-sale app with inventory, receipts, and CSV export | [Demo](https://clay3d11.github.io/POS-Demo/) · [Site](https://clay3d11.github.io/POS-PointOfSalesWebsite/) |
| Limitless Fitness | Fitness business platform with a REST lead-capture form | [View](https://clay3d11.github.io/FitnessPOS/) |
| Limitless Studio | Creative studio site with a Stripe Checkout flow | [View](https://clay3d11.github.io/LimitlessStudio/) |
| Limitless Reels | Real-estate video agency site with a booking form | [limitlessreels.com](http://limitlessreels.com/) |

## Tech stack

HTML5 · CSS3 (Grid, Flexbox, custom properties, container queries) · JavaScript (ES6+, Fetch API, IntersectionObserver) · Web3Forms · GitHub Pages

## Project structure

```
├── index.html     # Page markup: hero, projects, services, process, contact, and the bio and resume popups
├── style.css      # Theme, layout, and responsive styles
├── script.js      # Menu, popups, toggles, scroll animations, and contact form
├── resume.pdf     # Downloadable resume
├── assets/        # Images and project previews
├── CNAME          # Custom domain (clainerdev.com)
└── .nojekyll      # Tells GitHub Pages to serve the files as they are
```

## Run locally

This is a static site. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

GitHub Pages deploys the site from the `main` branch root to [clainerdev.com](https://clainerdev.com).
Every push to `main` goes live in about a minute.

## Contact

- Email: [v.clainer11@gmail.com](mailto:v.clainer11@gmail.com)
- GitHub: [@Clay3D11](https://github.com/Clay3D11)

© Clainer Ventura · Universal Limitless LLC
