-- REVIVIO V3: Add coverage decision columns to repair_requests

ALTER TABLE repair_requests
    ADD COLUMN IF NOT EXISTS coverage_decision VARCHAR(30),
    ADD COLUMN IF NOT EXISTS coverage_decision_reason TEXT;

UPDATE repair_requests
SET coverage_decision = 'COVERED_UNDER_WARRANTY',
    coverage_decision_reason = 'Covered under Revivio Care+ 24M hardware protection'
WHERE id = 1 AND coverage_decision IS NULL;
