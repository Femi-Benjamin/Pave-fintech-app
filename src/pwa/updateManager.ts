/**
 * Framework-free service worker update logic, kept separate from React so it
 * can be tested with fakes. It detects a waiting worker, asks the user before
 * activating it, tells the worker to take over, and reloads exactly once after
 * the new worker becomes the controller.
 */

export interface WorkerLike {
  state?: string;
  postMessage(message: unknown): void;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener?(type: string, listener: () => void): void;
}

export interface RegistrationLike {
  waiting: WorkerLike | null;
  installing: WorkerLike | null;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
  update(): Promise<unknown>;
}

export interface ContainerLike {
  controller: unknown;
  register(
    url: string,
    options: { scope: string; updateViaCache: "none" },
  ): Promise<RegistrationLike>;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export interface UpdateManagerDeps {
  container: ContainerLike;
  reload: () => void;
  confirm: (message: string) => boolean;
  onUpdateAvailable: (available: boolean) => void;
  setInterval?: (fn: () => void, ms: number) => number;
  clearInterval?: (id: number) => void;
}

export const UPDATE_CONFIRM_MESSAGE =
  "Updating PAVEPADI reloads this app. Finish any transfer, payment, or savings action first. Update now?";
export const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

export function createUpdateManager(deps: UpdateManagerDeps) {
  const { container } = deps;
  const setTimer = deps.setInterval ?? ((fn, ms) => window.setInterval(fn, ms));
  const clearTimer = deps.clearInterval ?? ((id) => window.clearInterval(id));

  let registration: RegistrationLike | undefined;
  let installing: WorkerLike | null = null;
  let timer: number | undefined;
  let started = false;
  let disposed = false;
  let updateRequested = false;
  let reloaded = false;

  const exposeWaiting = () => {
    deps.onUpdateAvailable(Boolean(registration?.waiting));
  };

  // An update only counts once the new worker has installed while an older
  // worker is still in control; the very first install is not an "update".
  const onInstallingStateChange = () => {
    if (installing?.state === "installed" && container.controller) {
      exposeWaiting();
    }
  };

  const onUpdateFound = () => {
    installing?.removeEventListener?.("statechange", onInstallingStateChange);
    installing = registration?.installing ?? null;
    installing?.addEventListener("statechange", onInstallingStateChange);
  };

  const onControllerChange = () => {
    if (!updateRequested || reloaded) return;
    reloaded = true;
    deps.reload();
  };

  const checkForUpdate = () => {
    void registration?.update().catch(() => undefined);
  };

  return {
    async start() {
      if (started || disposed) return;
      started = true;
      container.addEventListener("controllerchange", onControllerChange);
      try {
        const result = await container.register("/service-worker.js", {
          scope: "/",
          updateViaCache: "none",
        });
        if (disposed) return;
        registration = result;
        registration.addEventListener("updatefound", onUpdateFound);
        exposeWaiting();
        checkForUpdate();
        timer = setTimer(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
      } catch {
        /* registration failed — the app keeps working without a worker */
      }
    },

    checkForUpdate,

    /** Returns true if the user confirmed and the worker was told to activate. */
    requestUpdate() {
      const waiting = registration?.waiting;
      if (!waiting || !deps.confirm(UPDATE_CONFIRM_MESSAGE)) return false;
      updateRequested = true;
      waiting.postMessage({ type: "SKIP_WAITING" });
      return true;
    },

    dispose() {
      disposed = true;
      container.removeEventListener("controllerchange", onControllerChange);
      registration?.removeEventListener("updatefound", onUpdateFound);
      installing?.removeEventListener?.("statechange", onInstallingStateChange);
      if (timer !== undefined) clearTimer(timer);
    },
  };
}
