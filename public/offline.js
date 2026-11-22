/*
 * Retry logic for the offline page. It is an external file (not inline)
 * because the site's Content-Security-Policy only allows scripts from 'self'.
 */
(function (root) {
  var MESSAGES = {
    idle: "",
    checking: "Checking connection…",
    failed:
      "Still can't reach PAVEPADI. Check your data or Wi-Fi and try again.",
  };

  function probe(fetcher, timeoutMs) {
    var controller =
      typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller
      ? setTimeout(function () {
          controller.abort();
        }, timeoutMs)
      : null;
    return fetcher("/favicon.svg?retry=" + Date.now(), {
      method: "HEAD",
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        return response.ok;
      })
      .catch(function () {
        return false;
      })
      .then(function (ok) {
        if (timer) clearTimeout(timer);
        return ok;
      });
  }

  function init(deps) {
    var button = deps.button;
    var status = deps.status;
    var busy = false;
    var timer = null;

    function show(state) {
      status.textContent = MESSAGES[state];
      button.textContent =
        state === "checking" ? "Checking…" : "Retry connection";
      button.setAttribute("aria-disabled", state === "checking" ? "true" : "false");
    }

    function check(manual) {
      if (busy) return Promise.resolve(false);
      busy = true;
      show("checking");
      return probe(deps.fetch, deps.timeoutMs || 4000).then(function (ok) {
        busy = false;
        if (ok) {
          deps.goHome();
          return true;
        }
        show(manual ? "failed" : "idle");
        return false;
      });
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      check(true);
    });
    deps.onOnline(function () {
      check(false);
    });
    timer = deps.setInterval(function () {
      if (deps.isVisible()) check(false);
    }, deps.intervalMs || 8000);

    return {
      check: check,
      stop: function () {
        deps.clearInterval(timer);
      },
    };
  }

  var api = { init: init, probe: probe, MESSAGES: MESSAGES };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root && root.document && !root.__PAVE_OFFLINE_TEST__) {
    var doc = root.document;
    init({
      button: doc.getElementById("retry"),
      status: doc.getElementById("status"),
      fetch: root.fetch.bind(root),
      goHome: function () {
        root.location.replace("/");
      },
      onOnline: function (fn) {
        root.addEventListener("online", fn);
      },
      isVisible: function () {
        return doc.visibilityState === "visible";
      },
      setInterval: function (fn, ms) {
        return root.setInterval(fn, ms);
      },
      clearInterval: function (id) {
        root.clearInterval(id);
      },
    });
  }
})(typeof window !== "undefined" ? window : undefined);
