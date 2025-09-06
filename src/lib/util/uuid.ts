export function uuid() {
	if (window.crypto.randomUUID) return window.crypto.randomUUID();
	else return window.crypto.getRandomValues(new Uint32Array(4)).join("-");
}
