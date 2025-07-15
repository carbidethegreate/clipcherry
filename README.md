CLIPcherry

CLIPcherry is a premium, edge-first platform for creators to sell images and videos in exchange for cryptocurrency. It provides a seamless experience for creators to monetize exclusive content and for supporters to purchase and unlock that content with crypto payments.
Key Features

Edge-Powered Performance: CLIPcherry is built on Cloudflare’s global edge network, meaning content and API responses are delivered from servers closest to the user. This results in low-latency, fast-loading experiences worldwide.
Crypto Payments: The platform natively supports cryptocurrency transactions (e.g., XRP and Bitcoin). Supporters can pay with crypto, and creators earn in crypto, enabling instant, borderless transactions without traditional payment gateways.
Rich Media Support: Creators can sell high-resolution images and streaming video content. The platform handles image optimization and video streaming (via Cloudflare Stream), ensuring buyers get a smooth viewing experience.
Secure & Private: Content is protected by design. Images are blurred and videos are previewed until purchase, ensuring that only paying supporters gain full access. All data and transactions are secured through Cloudflare’s infrastructure and blockchain cryptography.
Accessible Design: The user interface follows a comprehensive style guide focused on accessibility and consistency (see the Graphics Standards Manual). Both light and dark themes are available, and the layout is responsive for mobile and desktop use.
Documentation

The project’s documentation is divided into several guides:
Technology Stack – A deep dive into the technologies and services that power CLIPcherry.
Technical Architecture – An overview of the system architecture and how the components interact (from Cloudflare Workers to blockchain payments).
Graphics Standards Manual – The visual style guide covering branding, UI design, and accessibility standards.
Getting Started (Development)

If you are a developer looking to run or contribute to CLIPcherry, follow these steps to get the project up and running locally:
Clone the repository
git clone https://github.com/your-org/clipcherry.git  
cd clipcherry
Install Cloudflare Wrangler (the CLI tool for Cloudflare Workers)
npm install -g wrangler
Configure Secrets
CLIPcherry uses a few secret keys for crypto transactions and encryption. These need to be added to your Cloudflare Worker environment (for development, you can use wrangler secret put to set them):
wrangler secret put XRP_SECRET          # Private key for XRP wallet
wrangler secret put BTC_XPUB           # Bitcoin Extended Public Key for deriving addresses
wrangler secret put ID_ENCRYPTION_KEY  # Key for encrypting IDs or sensitive data
Deploy to a Dev Environment
You can test the application in Cloudflare’s development environment (using your Cloudflare account credentials configured in Wrangler):
wrangler deploy
This will upload the Worker script and make it available at your Cloudflare Workers dev subdomain for testing.
Repository Layout

The repository is structured as follows:
Path	Description
/workers	Cloudflare Worker scripts (the backend logic running at the edge)
/schema	Database schema migration files for Cloudflare D1 (SQL)
/public	Static assets (compiled frontend HTML, CSS, JS)
/docs	Project documentation (markdown files for guides and manuals)
Local Development

During development, you can run a local preview of the Cloudflare Worker and static assets:
wrangler dev
This command will start a local server that emulates the Worker environment (and will serve the files in /public). It supports live reload, so any changes you save to the code will refresh in the dev environment. Use this to test functionality (for example, making a test purchase on a development network, or verifying that the blur/unblur logic works) before deploying updates.
License

This project is open source under the MIT License. See the LICENSE file for details.
