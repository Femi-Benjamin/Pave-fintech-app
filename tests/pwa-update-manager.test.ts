import assert from "node:assert/strict";
import test from "node:test";
import {
  createUpdateManager,
  UPDATE_CONFIRM_MESSAGE,
} from "../src/pwa/updateManager";
import type {
  ContainerLike,
  RegistrationLike,
  WorkerLike,
} from "../src/pwa/updateManager";

type Listener = () => void;

class Emitter {
  listeners = new Map<string, Set<Listener>>();
  addEventListener(type: string, fn: Listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
  }
  removeEventListener(type: string, fn: Listener) {
    this.listeners.get(type)?.delete(fn);
  }
  emit(type: string) {
    [...(this.listeners.get(type) ?? [])].forEach((fn) => fn());
  }
  count(type: string) {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeWorker extends Emitter implements WorkerLike {
  state = "installing";
  messages: unknown[] = [];
  postMessage(message: unknown) {
    this.messages.push(message);
  }
}

class FakeRegistration extends Emitter implements RegistrationLike {
  waiting: FakeWorker | null = null;
  installing: FakeWorker | null = null;
  updates = 0;
  async update() {
    this.updates += 1;
  }
}

class FakeContainer extends Emitter implements ContainerLike {
  controller: unknown = { active: true };
  registration = new FakeRegistration();
  registered: unknown[] = [];
  async register(url: string, options: { scope: string; updateViaCache: "none" }) {
    this.registered.push({ url, options });
    return this.registration;
  }
}

function setup(opts: { confirm?: boolean } = {}) {
  const container = new FakeContainer();
  const availability: boolean[] = [];
  let reloads = 0;
  const confirms: string[] = [];
  const timers: Array<{ fn: () => void; ms: number }> = [];
  const cleared: number[] = [];
  const manager = createUpdateManager({
    container,
    reload: () => {
      reloads += 1;
    },
    confirm: (message) => {
      confirms.push(message);
      return opts.confirm ?? true;
    },
    onUpdateAvailable: (value) => availability.push(value),
    setInterval: (fn, ms) => timers.push({ fn, ms }),
    clearInterval: (id) => cleared.push(id),
  } as Parameters<typeof createUpdateManager>[0]);
  return {
    container,
    manager,
    availability,
    confirms,
    timers,
    cleared,
    reloads: () => reloads,
  };
}

test("registers the worker with no HTTP caching and checks for updates", async () => {
  const t = setup();
  await t.manager.start();
  assert.deepEqual(t.container.registered, [
    {
      url: "/service-worker.js",
      options: { scope: "/", updateViaCache: "none" },
    },
  ]);
  assert.equal(t.container.registration.updates, 1);
  assert.equal(t.timers.length, 1);
});

test("detects a worker that is already waiting on load", async () => {
  const t = setup();
  t.container.registration.waiting = new FakeWorker();
  await t.manager.start();
  assert.deepEqual(t.availability, [true]);
});

test("detects a waiting worker after a new one installs while an old one controls the page", async () => {
  const t = setup();
  await t.manager.start();
  assert.deepEqual(t.availability, [false]);

  const worker = new FakeWorker();
  t.container.registration.installing = worker;
  t.container.registration.emit("updatefound");
  worker.state = "installed";
  t.container.registration.waiting = worker;
  worker.emit("statechange");

  assert.deepEqual(t.availability, [false, true]);
});

test("the very first install is not reported as an update", async () => {
  const t = setup();
  t.container.controller = null;
  await t.manager.start();

  const worker = new FakeWorker();
  t.container.registration.installing = worker;
  t.container.registration.emit("updatefound");
  worker.state = "installed";
  worker.emit("statechange");

  assert.deepEqual(t.availability, [false]);
});

test("activation needs user confirmation and sends SKIP_WAITING to the waiting worker", async () => {
  const t = setup({ confirm: true });
  const waiting = new FakeWorker();
  t.container.registration.waiting = waiting;
  await t.manager.start();

  assert.equal(t.manager.requestUpdate(), true);
  assert.deepEqual(t.confirms, [UPDATE_CONFIRM_MESSAGE]);
  assert.deepEqual(waiting.messages, [{ type: "SKIP_WAITING" }]);
});

test("declining the confirmation sends nothing and never reloads", async () => {
  const t = setup({ confirm: false });
  const waiting = new FakeWorker();
  t.container.registration.waiting = waiting;
  await t.manager.start();

  assert.equal(t.manager.requestUpdate(), false);
  assert.deepEqual(waiting.messages, []);
  t.container.emit("controllerchange");
  assert.equal(t.reloads(), 0);
});

test("without a waiting worker there is nothing to confirm or send", async () => {
  const t = setup();
  await t.manager.start();
  assert.equal(t.manager.requestUpdate(), false);
  assert.deepEqual(t.confirms, []);
});

test("reloads after the controller changes, but only because the user asked", async () => {
  const t = setup();
  t.container.registration.waiting = new FakeWorker();
  await t.manager.start();

  // Another tab updated the worker: this tab must not reload by itself.
  t.container.emit("controllerchange");
  assert.equal(t.reloads(), 0);

  t.manager.requestUpdate();
  t.container.emit("controllerchange");
  assert.equal(t.reloads(), 1);
});

test("repeated controller changes reload only once", async () => {
  const t = setup();
  t.container.registration.waiting = new FakeWorker();
  await t.manager.start();
  t.manager.requestUpdate();
  t.container.emit("controllerchange");
  t.container.emit("controllerchange");
  t.container.emit("controllerchange");
  assert.equal(t.reloads(), 1);
});

test("starting twice does not duplicate listeners or registrations", async () => {
  const t = setup();
  await t.manager.start();
  await t.manager.start();
  assert.equal(t.container.registered.length, 1);
  assert.equal(t.container.count("controllerchange"), 1);
  assert.equal(t.container.registration.count("updatefound"), 1);
});

test("repeated updatefound events keep a single statechange listener", async () => {
  const t = setup();
  await t.manager.start();
  const worker = new FakeWorker();
  t.container.registration.installing = worker;
  t.container.registration.emit("updatefound");
  t.container.registration.emit("updatefound");
  assert.equal(worker.count("statechange"), 1);
});

test("dispose removes every listener and stops the update timer", async () => {
  const t = setup();
  await t.manager.start();
  const worker = new FakeWorker();
  t.container.registration.installing = worker;
  t.container.registration.emit("updatefound");

  t.manager.dispose();
  assert.equal(t.container.count("controllerchange"), 0);
  assert.equal(t.container.registration.count("updatefound"), 0);
  assert.equal(worker.count("statechange"), 0);

  t.manager.requestUpdate();
  t.container.emit("controllerchange");
  assert.equal(t.reloads(), 0);
});

test("a registration that finishes after dispose is ignored", async () => {
  const t = setup();
  const started = t.manager.start();
  t.manager.dispose();
  await started;
  assert.equal(t.container.registration.count("updatefound"), 0);
  assert.deepEqual(t.availability, []);
});

test("a failed registration leaves the app working", async () => {
  const t = setup();
  t.container.register = async () => {
    throw new Error("blocked");
  };
  await t.manager.start();
  assert.deepEqual(t.availability, []);
});
