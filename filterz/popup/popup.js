// Auto sets color scheme
document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const ranges = {
  grayscale: { min: 0, max: 1, step: 0.01, default: 0, name: "Grayscale" },
  blur: { min: 0, max: 10, step: 0.1, default: 0, name: "Blur" },
  contrast: { min: 0, max: 3, step: 0.1, default: 1, name: "Contrast" },
  brightness: { min: 0, max: 3, step: 0.1, default: 1, name: "Brightness" },
  hueRotate: { min: 0, max: 360, step: 1, default: 0, name: "Hue rotate" },
  invert: { min: 0, max: 1, step: 0.01, default: 0, name: "Invert" },
  opacity: { min: 0, max: 1, step: 0.01, default: 1, name: "Opacity" },
  saturate: { min: 0, max: 3, step: 0.1, default: 1, name: "Saturate" },
  sepia: { min: 0, max: 1, step: 0.01, default: 0, name: "Sepia" }
};

let puppyImg = document.getElementById('puppy');
function changePuppy() {
  puppy.style.filter = `grayscale(${ranges.grayscale.input.value}) hue-rotate(${ranges.hueRotate.input.value}deg) invert(${ranges.invert.input.value}) blur(${ranges.blur.input.value}px) sepia(${ranges.sepia.input.value}) opacity(${ranges.opacity.input.value}) saturate(${ranges.saturate.input.value}) brightness(${ranges.brightness.input.value}) contrast(${ranges.contrast.input.value})`;
}

function applyFilters() {
  browser.tabs.query({ currentWindow: true, active: true })
    .then(tabs => browser.tabs.sendMessage(tabs[0].id, { "message": "apply" }));
}

let slidersDiv = document.getElementById('sliders');
function initializeFilter(filterName) {
  const div = `<div>
  <label for="${filterName}-range" class="float-start">${ranges[filterName].name}</label>
  <output for="${filterName}-range" id="${filterName}-output" class="text-end float-end"></output>
  <input type="range" class="form-range" min="${ranges[filterName].min}" max="${ranges[filterName].max}" step="${ranges[filterName].step}" id="${filterName}-range">
</div>`;
  slidersDiv.insertAdjacentHTML('afterbegin', div);
  ranges[filterName].input = document.getElementById(`${filterName}-range`);
  const output = document.getElementById(`${filterName}-output`);

  // Retrieve filter value from storage
  browser.storage.local.get(filterName)
    .then(result => {
      ranges[filterName].input.value = output.value = result[filterName];
    });

  // Update output value and trigger changePuppy() on input change
  ranges[filterName].input.oninput = function () {
    output.value = ranges[filterName].input.value;
    changePuppy();
  };

  // Save filter value to storage on change
  ranges[filterName].input.onchange = function () {
    browser.storage.local.set({ [filterName]: parseFloat(ranges[filterName].input.value) })
      .then(applyFilters);
  };
}

// Call the initializeFilter function for each filter
for (const key in ranges) {
  initializeFilter(key);
}






let filterToggle = document.getElementById('toggle-filters');
browser.storage.local.get('enabled').then(value => filterToggle.checked = value.enabled);

let btnReset = document.getElementById('btn-reset');
btnReset.onclick = function () {
  for (const key in ranges) {
    document.getElementById(`${key}-output`).value = ranges[key].input.value = ranges[key].default;
    changePuppy();
    browser.storage.local.set({ [key]: ranges[key].input.value }).then(applyFilters);
  }
}


document.getElementById('toggle-filters').onchange = function (event) {
  browser.storage.local.set({ enabled: event.target.checked }).then(applyFilters);
}