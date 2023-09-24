'use strict';

document.addEventListener("DOMContentLoaded", function () {
  // properties stores all of the information received from the local storage
  const properties = { grayscale: undefined, blur: undefined, contrast: undefined, brightness: undefined, hueRotate: undefined, invert: undefined, opacity: undefined, saturate: undefined, sepia: undefined, enabled: undefined };

  async function getFilters() {
    // Finds the values for all of the properties and returns a promise
    return Promise.all(Object.keys(properties).map(filter => browser.storage.local.get(filter)));
  }

  // Create a container element
  const container = document.createElement("div");
  container.style.cssText = `
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999;`;

  // Append the container to the body
  document.body.insertAdjacentElement('beforeend', container);

  function applyFilters(values) {
    // Goes through every value received and sets the appropriate properties value
    values.map((value) => properties[Object.keys(value)[0]] = Object.values(value)[0]);
    if (properties.enabled) {
      // Applies the filter to the element
      container.style.filter = `grayscale(${properties.grayscale}%) blur(${properties.blur}px) contrast(${properties.contrast}) brightness(${properties.brightness}) hue-rotate(${properties.hueRotate}deg) invert(${properties.invert}) opacity(${properties.opacity}) saturate(${properties.saturate}) sepia(${properties.sepia})`;
    } else {
      container.style.filter = '';
    }
  }

  getFilters()
    .then(applyFilters);
  browser.runtime.onMessage.addListener(
    function (request) {
      if (request.message === "apply") {
        getFilters()
          .then(applyFilters);
      }
    }
  );
})

