-- SQL schema for CLIPcherry platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  age_verified INTEGER DEFAULT 0,
  is_creator INTEGER DEFAULT 0,
  subscription_price_cents INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Content table storing items uploaded by creators
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'image' or 'video'
  image_id TEXT,
  video_uid TEXT,
  preview_image_id TEXT,
  preview_video_id TEXT,
  price_cents INTEGER NOT NULL,
  is_private INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Purchases table records one-time payments for content
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_id INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  crypto_address TEXT,
  destination_tag TEXT,
 CREATE TABLE IF NOT EXISTS content
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES content(id)
);

-- Subscriptions table for recurring creator support
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,
  amount_cents INTEGER,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  renew_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Messages table for chats between supporters and creators
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);
