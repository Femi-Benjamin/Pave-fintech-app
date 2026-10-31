import assert from "node:assert/strict";
import test from "node:test";
import { extractImageUrl, isHttpUrl } from "../src/utils/avatar";

test("extractImageUrl reads nested user.image", () => {
  assert.equal(extractImageUrl({ user: { image: "https://ik.imagekit.io/a.jpg" } }), "https://ik.imagekit.io/a.jpg");
});
test("extractImageUrl reads data.face and imageUrl", () => {
  assert.equal(extractImageUrl({ data: { face: "https://x.io/f.png" } }), "https://x.io/f.png");
  assert.equal(extractImageUrl({ imageUrl: "http://x.io/i.png" }), "http://x.io/i.png");
});
test("extractImageUrl rejects blob:, relative and missing values", () => {
  assert.equal(extractImageUrl({ user: { image: "blob:http://localhost/abc" } }), null);
  assert.equal(extractImageUrl({ image: "/uploads/a.png" }), null);
  assert.equal(extractImageUrl({}), null);
  assert.equal(extractImageUrl(null), null);
});
test("isHttpUrl", () => {
  assert.equal(isHttpUrl("https://a.b"), true);
  assert.equal(isHttpUrl("blob:x"), false);
  assert.equal(isHttpUrl(undefined), false);
});
