CREATE SCHEMA IF NOT EXISTS star_wars;

CREATE TABLE IF NOT EXISTS star_wars.characters (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL,
  "planet" TEXT,
  CONSTRAINT "UQ_star_wars_characters_name" UNIQUE ("name"),
  CONSTRAINT "PK_star_wars_characters_id" PRIMARY KEY ("id")
)