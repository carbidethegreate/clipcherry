#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const cfImageRegex = /https:\/\/imagedelivery\.net\/([A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+(?:\/public)?)/g;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(html|xml|json|webmanifest)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

function ensureBackup(file) {
  const bak = file + '.bak';
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(file, bak);
  }
}

function toAbsolute(url) {
  if (url.startsWith('https://vibankruptcy.com')) return url;
  if (url.startsWith('https://')) return url;
  if (url.startsWith('/')) return 'https://vibankruptcy.com' + url;
  return 'https://vibankruptcy.com/' + url;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace Cloudflare Images URLs
  content = content.replace(cfImageRegex, 'https://vibankruptcy.com/cdn-cgi/imagedelivery/$1');

  // Replace preconnect tags
  content = content.replace(/<link\s+rel=["']preconnect["']\s+href=["']https:\/\/imagedelivery\.net["'][^>]*>/gi,
    '<link rel="preconnect" href="https://vibankruptcy.com">');

  // Update og:image and twitter:image
  content = content.replace(/(<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["'])(?!https:\/\/vibankruptcy\.com)([^"']+)/gi,
    (m, p1, url) => p1 + toAbsolute(url));

  // Update favicon links
  content = content.replace(/(<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["'])(?!https:\/\/vibankruptcy\.com)([^"']+)/gi,
    (m, p1, url) => p1 + toAbsolute(url));

  if (/\.(json|webmanifest)$/.test(file)) {
    try {
      const json = JSON.parse(content);
      if (Array.isArray(json.icons)) {
        json.icons = json.icons.map(icon => {
          if (icon.src) {
            icon.src = icon.src.replace(cfImageRegex, 'https://vibankruptcy.com/cdn-cgi/imagedelivery/$1');
            icon.src = toAbsolute(icon.src);
          }
          return icon;
        });
      }
      content = JSON.stringify(json, null, 2);
    } catch (e) {
      // ignore parse errors
    }
  }

  if (content !== original) {
    ensureBackup(file);
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}

walk(rootDir);
