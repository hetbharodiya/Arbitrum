# Arbitrum Builder Labs Web3 Assignment

## Project Overview
This project is a 4-page responsive website designed to introduce foundational Web3 concepts, in fulfillment of the Arbitrum Builder Labs assignment by LamprosDAO. The website emphasizes a premium, dynamic design with dark mode aesthetics and features functional components built purely with HTML, CSS, and Vanilla JavaScript.

## Pages
1. **Home / Landing (`index.html`)**: Introduces Arbitrum as an Ethereum Layer 2 scaling solution. Highlights why Layer 2 is necessary, how Arbitrum works using Optimistic Rollups, and the real-world benefits it provides.
2. **Concepts (`concepts.html`)**: A visual reference page with side-by-side comparison cards explaining core Web3 concepts: Web2 vs Web3, Ethereum vs Bitcoin, Public vs Private Keys, and Blockchain vs Traditional Databases.
3. **Live Prices (`prices.html`)**: A dynamic dashboard fetching real-time prices and 24-hour change percentages for Bitcoin, Ethereum, and Arbitrum using the CoinGecko API. Includes a manual refresh button.
4. **Block Simulator (`simulator.html`)**: An interactive mining simulator that demonstrates proof-of-work concepts (nonce, hashing) and chain immutability. Changing data in Block 1 automatically invalidates Block 2.

## Technologies Used
- HTML5
- CSS3 (Vanilla CSS, CSS Grid, Flexbox, Custom Variables)
- Vanilla JavaScript (Fetch API, Web Crypto API for SHA-256 hashing)

## How to Run Locally
Since this project uses pure HTML, CSS, and JavaScript with no build steps or bundlers, it is extremely easy to run locally.

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (e.g., Chrome, Firefox, Edge, Safari).
3. Navigate the site using the top navigation bar.

*Note: The Block Simulator relies on the Web Crypto API, which requires a secure context. Most modern browsers will allow this when opening local files directly (`file://`), but if you encounter issues with the simulator hashing, try running a simple local server (e.g., `npx http-server`, `python -m http.server`, or the Live Server VSCode extension).*

## Known Issues / Improvements
- The block mining simulator runs asynchronously to avoid freezing the UI, but because it relies on pure JavaScript hashing, mining higher difficulties (more than two leading zeroes) could still cause temporary UI lag.
- The CoinGecko API has rate limits for its free tier. Refreshing the Live Prices page too quickly may result in temporary API blocks (429 Too Many Requests).
- Future improvements could include mobile hamburger navigation for smaller screens.
