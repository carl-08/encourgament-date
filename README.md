# Encouragement Date

A small, static invitation website built with HTML, CSS, and vanilla JavaScript.

## Design

- Romantic editorial styling with ivory, blush, burgundy, and antique-gold accents.
- Playfair Display for headings, Lora for letter copy, and Inter for interface text.
- An envelope-opening animation and a letter reveal with reduced-motion support.
- Responsive layouts for mobile and desktop.
- Keyboard-accessible envelope, dialog close behavior, focus handling, and live response announcements.

## Interaction

1. Activate the envelope to reveal the invitation.
2. Choose **Yes, I'd love to** or **Maybe later**. Both choices are respected and show a distinct response.
3. Close the letter with the close button or Escape; the envelope can be opened again.

## Run locally

No build step or backend is required. Open `index.html` in a modern browser, or serve the folder with any static web server.

The font stylesheet loads from Google Fonts when internet access is available; system serif and sans-serif fallbacks are provided.

## Assets

The current design draws the wax seal as inline SVG and uses CSS for the background. Existing image files are retained in the repository for now; unused files can be reviewed separately before removing or compressing them.

## Accessibility and privacy

- Supports keyboard operation and visible focus indicators.
- Allows browser zoom and text selection.
- Respects `prefers-reduced-motion`.
- No analytics, tracking, or backend services are included.
