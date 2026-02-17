import './style.css';
import { subscribe, state, updateState, getSelectedTheme } from './src/core/state.js';
import { initMap, updateMapTheme, invalidateMapSize } from './src/map/map-init.js';
import { setupControls, updatePreviewStyles } from './src/ui/form.js';
import { exportToPNG } from './src/core/export.js';

const initialTheme = getSelectedTheme();
initMap('map-preview', [state.lat, state.lon], state.zoom, initialTheme.tileUrl);

const syncUI = setupControls();

subscribe((currentState) => {
	const theme = getSelectedTheme();
	const tileUrl = currentState.showLabels ? theme.tileUrl : theme.tileUrlNoLabels;
	updateMapTheme(tileUrl);

	updatePreviewStyles(currentState);

	syncUI(currentState);
});

const exportBtn = document.getElementById('export-btn');
const exportStatus = document.getElementById('export-status');
const posterContainer = document.getElementById('poster-container');

exportBtn.addEventListener('click', async () => {
	const filename = `MapToPoster-${state.city.replace(/\s+/g, '-')}-${Date.now()}.png`;
	await exportToPNG(posterContainer, filename, exportStatus);
});

window.addEventListener('resize', () => {
	updatePreviewStyles(state);
});

setTimeout(invalidateMapSize, 500);
