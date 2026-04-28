CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'series')),
  genre TEXT[] NOT NULL,
  year INTEGER NOT NULL,
  language VARCHAR(100) NOT NULL,
  quality VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  sample_images TEXT[] NOT NULL,
  download_480p TEXT,
  download_720p TEXT,
  download_1080p TEXT,
  download_2k TEXT,
  status VARCHAR(50) DEFAULT 'published',
  tags TEXT[] NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster searching
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_views ON movies(views DESC);
