-- Migration: 004_add_share_token_to_trips
-- Adds a unique share_token column to the trips table for shareable trip links.

ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS share_token VARCHAR(64) UNIQUE;
