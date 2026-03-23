CREATE TABLE public.gmail_watch_state (
  id         INT PRIMARY KEY DEFAULT 1,
  history_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
