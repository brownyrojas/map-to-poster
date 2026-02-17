import L from 'leaflet';
import { updateState } from '../core/state.js';

let map = null;
let tileLayer = null;

export function initMap(containerId, initialCenter, initialZoom, initialTileUrl) {
	map = L.map(containerId, {
		zoomControl: false,
		attributionControl: false,
		scrollWheelZoom: 'center',
		touchZoom: 'center'
	}).setView(initialCenter, initialZoom);

	tileLayer = L.tileLayer(initialTileUrl, {
		maxZoom: 19,
		crossOrigin: true,
	}).addTo(map);

	map.on('moveend', () => {
		const center = map.getCenter();
		updateState({
			lat: center.lat,
			lon: center.lng,
			zoom: map.getZoom()
		});
	});

	return map;
}

export function updateMapPosition(lat, lon, zoom, options = { animate: true }) {
	if (map) {
		if (lat !== undefined && lon !== undefined) {
			map.setView([lat, lon], zoom || map.getZoom(), options);
		} else if (zoom !== undefined) {
			map.setZoom(zoom, options);
		}
	}
}

export function updateMapTheme(tileUrl) {
	if (tileLayer) {
		tileLayer.setUrl(tileUrl);
	}
}

export function waitForTilesLoad(timeout = 5000) {
	return new Promise((resolve) => {
		if (!map || !tileLayer) return resolve();

		let resolved = false;
		const onLoad = () => {
			if (resolved) return;
			resolved = true;
			clearTimeout(timer);
			resolve();
		};

		tileLayer.once('load', onLoad);

		const timer = setTimeout(() => {
			if (resolved) return;
			resolved = true;
			resolve();
		}, timeout);
	});
}

export function getMapInstance() {
	return map;
}

export function invalidateMapSize() {
	if (map) {
		map.invalidateSize();
	}
}
