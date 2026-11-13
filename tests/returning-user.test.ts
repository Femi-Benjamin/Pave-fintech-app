import assert from "node:assert/strict";
import { test } from "node:test";

let jar = "";
(globalThis as any).document = {
  get cookie() {
    return jar;
  },
  set cookie(v: string) {
    jar = v.split(";")[0];
  },
};

test("returning-user cookie: unset, then set after markReturningUser", async () => {
  const { isReturningUser, markReturningUser } = await import("../src/lib/authStorage");
  assert.equal(isReturningUser(), false);
  markReturningUser();
  assert.equal(isReturningUser(), true);
  assert.equal(jar, "pave_returning=1");
});
