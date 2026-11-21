-- Run this ONCE in pgAdmin (Query Tool on the samaagum database) AFTER `prisma migrate dev`
-- has created the tables. It makes the ledger append-only: any UPDATE or DELETE fails.
-- Prisma does not manage triggers, so keep this file in the repo and re-run it if you reset the database.

CREATE OR REPLACE FUNCTION forbid_ledger_changes() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'LedgerEntry is append-only: % is not allowed', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ledger_no_update_delete ON "LedgerEntry";
CREATE TRIGGER ledger_no_update_delete
  BEFORE UPDATE OR DELETE ON "LedgerEntry"
  FOR EACH ROW EXECUTE FUNCTION forbid_ledger_changes();

-- Check query: every transaction must balance. This should return ZERO rows.
-- SELECT "transactionId"
-- FROM "LedgerEntry"
-- GROUP BY "transactionId"
-- HAVING SUM(CASE WHEN direction = 'DEBIT' THEN "amountPaise" ELSE -"amountPaise" END) <> 0;
