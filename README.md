# CLIPcherry

Premium edge‑first platform for creators to sell images and videos for crypto.

## Getting Started

1. **Clone repo**

   ```bash
   git clone https://github.com/your‑org/clipcherry.git
   cd clipcherry
   ```
2. **Install Wrangler** (Cloudflare CLI)

   ```bash
   npm install -g wrangler
   ```
3. **Configure secrets**

   ```bash
   wrangler secret put XRP_SECRET
   wrangler secret put BTC_XPUB
   wrangler secret put ID_ENCRYPTION_KEY
   ```
4. **Deploy to dev account**

   ```bash
   wrangler deploy
   ```

## Repo Layout

| Path       | Description                         |
| ---------- | ----------------------------------- |
| `/workers` | Cloudflare Worker scripts           |
| `/schema`  | D1 schema migrations                |
| `/public`  | Static assets, compiled CSS, JS     |
| `/docs`    | Project docs, including this README |

## Local Dev

Run `wrangler dev` to test the Worker and KV locally with Live Reload.

## License

MIT
