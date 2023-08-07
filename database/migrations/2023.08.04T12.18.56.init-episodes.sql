CREATE TABLE IF NOT EXISTS star_wars.episodes (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL,
  CONSTRAINT "UQ_star_wars_episodes_name" UNIQUE ("name"),
  CONSTRAINT "PK_star_wars_episodes_id" PRIMARY KEY ("id")
);
