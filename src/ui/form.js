import { state, updateState, getSelectedTheme } from '../core/state.js';
import { updateMapPosition, invalidateMapSize } from '../map/map-init.js';
import { searchLocation, formatCoords } from '../map/geocoder.js';

export function setupControls() {
	const searchInput = document.getElementById('search-input');
	const searchResults = document.getElementById('search-results');
	const latInput = document.getElementById('lat-input');
	const lonInput = document.getElementById('lon-input');
	const zoomSlider = document.getElementById('zoom-slider');
	const zoomValue = document.getElementById('zoom-value');
	const themeSelect = document.getElementById('theme-select');
	const labelsToggle = document.getElementById('show-labels-toggle');
	const overlayToggle = document.getElementById('overlay-bg-toggle');
	const customW = document.getElementById('custom-w');
	const customH = document.getElementById('custom-h');
	const presetBtns = document.querySelectorAll('.preset-btn');

	let searchTimeout;
	searchInput.addEventListener('input', (e) => {
		clearTimeout(searchTimeout);
		const query = e.target.value;
		if (query.length < 3) {
			searchResults.classList.add('hidden');
			return;
		}

		searchTimeout = setTimeout(async () => {
			const results = await searchLocation(query);
			if (results.length > 0) {
				searchResults.innerHTML = results.map(r => `
          <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.shortName}">
            ${r.name}
          </div>
        `).join('');
				searchResults.classList.remove('hidden');
			} else {
				searchResults.classList.add('hidden');
			}
		}, 500);
	});

	searchResults.addEventListener('click', (e) => {
		const item = e.target.closest('[data-lat]');
		if (item) {
			const lat = parseFloat(item.dataset.lat);
			const lon = parseFloat(item.dataset.lon);
			const name = item.dataset.name;

			updateState({ city: name.toUpperCase(), lat, lon });
			updateMapPosition(lat, lon);

			searchInput.value = name;
			searchResults.classList.add('hidden');
		}
	});

	latInput.addEventListener('change', (e) => {
		const lat = parseFloat(e.target.value);
		updateState({ lat });
		updateMapPosition(lat, state.lon);
	});

	lonInput.addEventListener('change', (e) => {
		const lon = parseFloat(e.target.value);
		updateState({ lon });
		updateMapPosition(state.lat, lon);
	});

	zoomSlider.addEventListener('input', (e) => {
		const zoom = parseInt(e.target.value);
		updateState({ zoom });
		updateMapPosition(undefined, undefined, zoom);
	});

	themeSelect.addEventListener('change', (e) => {
		updateState({ theme: e.target.value });
	});

	if (labelsToggle) {
		labelsToggle.addEventListener('change', (e) => {
			updateState({ showLabels: e.target.checked });
		});
	}

	if (overlayToggle) {
		overlayToggle.addEventListener('change', (e) => {
			updateState({ overlayBgEnabled: e.target.checked });
		});
	}

	presetBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			const width = parseInt(btn.dataset.width);
			const height = parseInt(btn.dataset.height);
			updateState({ width, height });
		});
	});

	customW.addEventListener('change', (e) => updateState({ width: parseInt(e.target.value) || state.width }));
	customH.addEventListener('change', (e) => updateState({ height: parseInt(e.target.value) || state.height }));

	return (currentState) => {
		latInput.value = currentState.lat.toFixed(6);
		lonInput.value = currentState.lon.toFixed(6);
		zoomSlider.value = currentState.zoom;
		zoomValue.textContent = currentState.zoom;
		themeSelect.value = currentState.theme;
		if (labelsToggle) labelsToggle.checked = !!currentState.showLabels;
		if (overlayToggle) overlayToggle.checked = !!currentState.overlayBgEnabled;
		customW.value = currentState.width;
		customH.value = currentState.height;
	};
}

let lastWidth = null;
let lastHeight = null;

export function updatePreviewStyles(currentState) {
	const posterContainer = document.getElementById('poster-container');
	const posterScaler = document.getElementById('poster-scaler');
	const displayCity = document.getElementById('display-city');
	const displayCoords = document.getElementById('display-coords');
	const overlay = document.getElementById('poster-overlay');
	const overlayBg = overlay.querySelector('.overlay-bg');
	const divider = document.getElementById('poster-divider');

	const theme = getSelectedTheme();

	const sizeChanged = lastWidth !== currentState.width || lastHeight !== currentState.height;
	lastWidth = currentState.width;
	lastHeight = currentState.height;

	posterContainer.style.width = `${currentState.width}px`;
	posterContainer.style.height = `${currentState.height}px`;

	const parent = posterScaler.parentElement;
	const padding = 120;
	const availableW = parent.clientWidth - padding;
	const availableH = parent.clientHeight - padding;

	const scaleW = availableW / currentState.width;
	const scaleH = availableH / currentState.height;
	const scale = Math.min(scaleW, scaleH, 1);

	posterScaler.style.transform = `scale(${scale})`;

	displayCity.textContent = currentState.city;
	displayCity.style.color = theme.textColor;
	displayCoords.textContent = formatCoords(currentState.lat, currentState.lon);
	displayCoords.style.color = theme.textColor;

	if (overlayBg) {
		if (currentState.overlayBgEnabled) {
			overlayBg.style.display = '';
			overlayBg.style.backgroundColor = theme.overlayBg;
			overlayBg.style.opacity = '0.9';
		} else {
			overlayBg.style.display = 'none';
		}
	}
	if (divider) divider.style.backgroundColor = theme.textColor;

	invalidateMapSize();

	if (sizeChanged) {
		setTimeout(() => {
			invalidateMapSize();
			updateMapPosition(currentState.lat, currentState.lon, currentState.zoom, { animate: false });
		}, 350);

		setTimeout(() => {
			invalidateMapSize();
			updateMapPosition(currentState.lat, currentState.lon, currentState.zoom, { animate: false });
		}, 550);
	}
}
