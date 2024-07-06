import {error} from "@sveltejs/kit";
import {dev} from "$app/environment";

// Temporary helper to hide in-development pages from production

// Source: https://stackoverflow.com/a/73638129
// Source: https://stackoverflow.com/a/68074574

export function load() {
	if (!dev) {
		error(404, "Not Found");
	}
}

// if (!dev) {
// 	error(404, "Not Found");
// }

// export const prerender = dev;
export const ssr = dev;
export const csr = dev;
