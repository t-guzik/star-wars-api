create schema if not exists star_wars;

create table if not exists star_wars.characters (
  "id" text not null,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now(),
  "name" text not null,
  "planet" text,
  "episodes_ids" jsonb not null,
  constraint "UQ_star_wars_characters_name" unique ("name"),
  constraint "PK_star_wars_characters_id" primary key ("id")
)