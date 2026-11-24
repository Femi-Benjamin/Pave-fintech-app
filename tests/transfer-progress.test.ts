import assert from "node:assert/strict";
import {
  transferPollInterval,
  transferView,
  latestTransferStatus,
} from "../src/utils/transferProgress";

assert.equal(transferPollInterval("success", 0), false);
assert.equal(transferPollInterval("failed", 0), false);
assert.equal(transferPollInterval("pending", 1000), 3000);
assert.equal(transferPollInterval("pending", 120_000), 6000);
assert.equal(transferPollInterval("pending", 600_000), 15000);
assert.equal(latestTransferStatus("successful", "pending"), "success");
assert.equal(latestTransferStatus(undefined, "pending"), "pending");
assert.equal(latestTransferStatus("FAILED", "pending"), "failed");
assert.equal(transferView("success").variant, "success");
assert.equal(transferView("success").statusLabel, "Successful");
assert.equal(transferView("failed").statusLabel, "Failed");
assert.equal(transferView("pending").title, "Transfer initiated");
console.log("transfer-progress ok");
