import { state } from '../core/state.js';

export function generateMapLibreStyle(theme) {
	const style = {
		version: 8,
		names: theme.name,
		sources: {
			openfreemap: {
				type: 'vector',
				url: 'https://tiles.openfreemap.org/planet'
			},
			'route-source': {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: [[state.routeStartLon, state.routeStartLat], [state.routeEndLon, state.routeEndLat]]
					}
				}
			}
		},
		layers: [
			{
				id: 'background',
				type: 'background',
				paint: { 'background-color': theme.bg }
			},
			{
				id: 'water',
				source: 'openfreemap',
				'source-layer': 'water',
				type: 'fill',
				paint: { 'fill-color': theme.water }
			},
			{
				id: 'park',
				source: 'openfreemap',
				'source-layer': 'park',
				type: 'fill',
				paint: { 'fill-color': theme.parks }
			},
			{
				id: 'road-default',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['!', ['match', ['get', 'class'], ['motorway', 'primary', 'secondary', 'tertiary', 'residential'], true, false]],
				paint: { 'line-color': theme.road_default, 'line-width': 0.5 }
			},
			{
				id: 'road-residential',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['==', ['get', 'class'], 'residential'],
				paint: { 'line-color': theme.road_residential, 'line-width': 0.5 }
			},
			{
				id: 'road-tertiary',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['==', ['get', 'class'], 'tertiary'],
				paint: { 'line-color': theme.road_tertiary, 'line-width': 0.8 }
			},
			{
				id: 'road-secondary',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['==', ['get', 'class'], 'secondary'],
				paint: { 'line-color': theme.road_secondary, 'line-width': 1.0 }
			},
			{
				id: 'road-primary',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['==', ['get', 'class'], 'primary'],
				paint: { 'line-color': theme.road_primary, 'line-width': 1.5 }
			},
			{
				id: 'road-motorway',
				source: 'openfreemap',
				'source-layer': 'transportation',
				type: 'line',
				filter: ['==', ['get', 'class'], 'motorway'],
				paint: { 'line-color': theme.road_motorway, 'line-width': 2.0 }
			},
			{
				id: 'place-labels',
				source: 'openfreemap',
				'source-layer': 'place',
				type: 'symbol',
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
					'text-size': 12,
					'text-anchor': 'center',
					'text-offset': [0, 0],
					'visibility': state.showLabels ? 'visible' : 'none'
				},
				paint: {
					'text-color': theme.text || '#000000',
					'text-halo-color': theme.bg || '#ffffff',
					'text-halo-width': 1.5,
					'text-opacity': 0.8
				}
			},
			{
				id: 'road-labels',
				source: 'openfreemap',
				'source-layer': 'transportation_name',
				type: 'symbol',
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
					'text-size': 10,
					'text-anchor': 'center',
					'text-max-angle': 30,
					'symbol-placement': 'line',
					'symbol-spacing': 250,
					'text-rotation-alignment': 'map',
					'text-pitch-alignment': 'viewport',
					'visibility': state.showLabels ? 'visible' : 'none'
				},
				paint: {
					'text-color': theme.text || '#000000',
					'text-halo-color': theme.bg || '#ffffff',
					'text-halo-width': 1,
					'text-opacity': 0.6
				}
			},
			{
				id: 'route-line-casing',
				source: 'route-source',
				type: 'line',
				layout: {
					'line-cap': 'round',
					'line-join': 'round',
					'visibility': state.showRoute ? 'visible' : 'none'
				},
				paint: {
					'line-color': theme.bg || '#ffffff',
					'line-width': 9
				}
			},
			{
				id: 'route-line-glow',
				source: 'route-source',
				type: 'line',
				layout: {
					'line-cap': 'round',
					'line-join': 'round',
					'visibility': state.showRoute ? 'visible' : 'none'
				},
				paint: {
					'line-color': theme.route || '#EF4444',
					'line-width': 12,
					'line-blur': 4,
					'line-opacity': 0.6
				}
			},
			{
				id: 'route-line',
				source: 'route-source',
				type: 'line',
				layout: {
					'line-cap': 'round',
					'line-join': 'round',
					'visibility': state.showRoute ? 'visible' : 'none'
				},
				paint: {
					'line-color': theme.route || '#EF4444',
					'line-width': 5
				}
			}
		]
	};
	return style;
}
