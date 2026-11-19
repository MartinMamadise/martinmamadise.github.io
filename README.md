# Martin Mamadise | Portfolio

Personal portfolio of **Martin Mamadise**, a Computer Engineering graduate (BEng Tech, CPUT) based in Cape Town, South Africa. It covers embedded firmware, networked IoT systems and full-stack web development.

**Live site:** [martinmamadise.github.io](https://martinmamadise.github.io)

## What's on the site

- **About and skills** across embedded systems, software development, networking and IoT, databases, web development and signal processing
- **Featured projects** with filters for Software, Embedded & IoT and Networking
- **Interactive previews** that run in the browser with no server:
  - Support Ticket Tracker
  - SDN path-comparison model
- **Downloadable CV** and links to GitHub and LinkedIn
- **Contact form** that falls back to the visitor's email app when no backend is connected
- **Light and dark mode** and a fully responsive layout

## Featured projects

| Project | Stack |
| --- | --- |
| Support Ticket Tracker | Java, Spring Boot, Angular, TypeScript, MySQL |
| SDN Traffic Engineering & Network Management App | Python, Tkinter, OpenDaylight, RESTCONF, PCEP, GNS3 |
| Smart Agriculture Monitoring System | ESP32, C/C++, IoT sensors, Firebase |
| Solar-Powered Washing Machine Controller | ATmega328P, C++, energy management |
| Traffic Engineering with Graph Theory & Linear Programming | Python, optimisation, NSFNET |

## Built with

- HTML, CSS and vanilla JavaScript (no framework or build step)
- Google Fonts (Manrope and IBM Plex Mono)
- Hosted on GitHub Pages
- Optional contact backend: Node.js, Express and Nodemailer

## Project structure

```
.
├── index.html                  # Page content
├── style.css                   # Styles and theming
├── script.js                   # Interactions, previews and contact form
├── Martin_Mamadise_CV.pdf      # Downloadable CV
├── assets/                     # Photo and project source files
└── backend/                    # Optional contact-form API (Express)
```

## Run locally

The site is static, so there is nothing to install.

1. Clone the repository:
   ```bash
   git clone https://github.com/MartinMamadise/martinmamadise.github.io.git
   cd martinmamadise.github.io
   ```
2. Open `index.html` in your browser, or serve the folder with any static server:
   ```bash
   npx serve .
   ```

## Optional: contact form backend

GitHub Pages can only host static files, so the Express backend in `backend/` is not part of the live site. Without it, the contact form opens the visitor's email app instead.

To enable direct sending:

1. Go to the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your details. Never commit `.env`; it is already in `.gitignore`:
   ```
   EMAIL=your-gmail@gmail.com
   APP_PASSWORD=your-gmail-app-password
   PORT=3000
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Deploy the backend to a host such as Render, then set `API_URL` in `script.js` to your deployed endpoint, for example `https://your-api.onrender.com/api/contact`.

## Deployment

The site is deployed from the `main` branch (root folder) using GitHub Pages. Every push to `main` updates the live site within a minute or two.

## Contact

- Email: [martinmamadise80@gmail.com](mailto:martinmamadise80@gmail.com)
- LinkedIn: [linkedin.com/in/martinmamadise](https://linkedin.com/in/martinmamadise)
- GitHub: [github.com/MartinMamadise](https://github.com/MartinMamadise)

Open to internships and graduate roles.

## Licence

&copy; 2026 Martin Mamadise. All rights reserved. The code is shown for portfolio purposes. Please ask before reusing the design or content.
