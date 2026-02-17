import html2canvas from 'html2canvas';
import { invalidateMapSize, waitForTilesLoad } from '../map/map-init.js';

function waitForImages(root, timeout = 7000) {
	const imgs = Array.from(root.querySelectorAll('img'));
	if (imgs.length === 0) return Promise.resolve();

	return new Promise((resolve) => {
		let remaining = imgs.length;
		const onDone = () => {
			remaining -= 1;
			if (remaining <= 0) resolve();
		};

		const timer = setTimeout(() => resolve(), timeout);

		imgs.forEach(img => {
			if (img.complete) return onDone();
			img.addEventListener('load', onDone);
			img.addEventListener('error', onDone);
		});
	});
}

function createExportClone(element, width, height) {
	const clone = element.cloneNode(true);
	clone.style.transform = 'none';
	clone.style.position = 'fixed';
	clone.style.left = '-99999px';
	clone.style.top = '0';
	clone.style.width = typeof width === 'number' ? `${width}px` : width;
	clone.style.height = typeof height === 'number' ? `${height}px` : height;
	clone.style.margin = '0';
	clone.style.visibility = 'visible';
	clone.id = 'export-clone';
	document.body.appendChild(clone);
	return clone;
}

export async function exportToPNG(element, filename, statusElement) {
	if (statusElement) statusElement.classList.remove('hidden');

	try {
		await new Promise(resolve => setTimeout(resolve, 500));

		invalidateMapSize();
		await waitForTilesLoad(7000);

		const cssWidth = Math.max(1, element.clientWidth);
		const cssHeight = Math.max(1, element.clientHeight);

		if (document.fonts && document.fonts.ready) {
			try { await document.fonts.ready; } catch (e) { }
		}

		const clone = createExportClone(element, cssWidth, cssHeight);

		await waitForImages(clone, 8000);

		try {
			const clonedCity = clone.querySelector('#display-city');
			if (clonedCity) {
				clonedCity.style.transform = (clonedCity.style.transform || '') + ' translateY(-40px)';
			}
		} catch (e) { }

		const scale = window.devicePixelRatio || 1;

		const canvas = await html2canvas(clone, {
			useCORS: true,
			scale,
			logging: false,
			backgroundColor: null,
		});

		if (clone && clone.parentNode) clone.parentNode.removeChild(clone);

		const link = document.createElement('a');
		link.download = filename;
		link.href = canvas.toDataURL('image/png');
		link.click();
	} catch (error) {
		console.error('Export failed:', error);
		alert('Export failed. Please check internet connection for tiles or try again.');
	} finally {
		if (statusElement) statusElement.classList.add('hidden');
	}
}
