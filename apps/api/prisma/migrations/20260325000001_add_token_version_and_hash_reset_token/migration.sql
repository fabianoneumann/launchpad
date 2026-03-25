-- AlterTable: rename token to token_hash in password_reset_tokens
ALTER TABLE "password_reset_tokens" RENAME COLUMN "token" TO "token_hash";

-- AlterIndex: rename unique index to match new column name
ALTER INDEX "password_reset_tokens_token_key" RENAME TO "password_reset_tokens_token_hash_key";

-- AlterTable: add token_version to users
ALTER TABLE "users" ADD COLUMN "token_version" INTEGER NOT NULL DEFAULT 0;
