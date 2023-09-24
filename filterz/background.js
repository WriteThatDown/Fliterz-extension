browser.runtime.onInstalled.addListener(function () {
  browser.storage.local.set({ grayscale: 0 });
  browser.storage.local.set({ blur: 0 });
  browser.storage.local.set({ contrast: 1 });
  browser.storage.local.set({ brightness: 1 });
  browser.storage.local.set({ hueRotate: 0 });
  browser.storage.local.set({ invert: 0 });
  browser.storage.local.set({ opacity: 1 });
  browser.storage.local.set({ saturate: 1 });
  browser.storage.local.set({ sepia: 0 });
  browser.storage.local.set({ enabled: true })
});