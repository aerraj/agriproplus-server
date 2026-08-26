import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../app.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => new Promise((resolve) => server.close(resolve)));

test("health reports readiness", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.status, "healthy");
});

test("schemes degrade safely without database configuration", async () => {
  const response = await fetch(`${baseUrl}/api/schemes`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(payload.items, []);
});

test("contact form rejects incomplete data", async () => {
  const response = await fetch(`${baseUrl}/api/message/send`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "farmer@example.com" }),
  });
  assert.equal(response.status, 422);
});

test("crop intelligence recommends rice for a representative field", async () => {
  const response = await fetch(`${baseUrl}/api/crops/recommend`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ N: 90, P: 42, K: 43, temperature: 20.9, humidity: 82, pH: 6.5, rainfall: 202.9 }),
  });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.recommended_crop, "rice");
  assert.ok(payload.confidence > 0.9);
  assert.equal(payload.model_version, "agripro-rf-2026.1");
});
