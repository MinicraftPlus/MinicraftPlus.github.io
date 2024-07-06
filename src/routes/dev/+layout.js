import {error} from "@sveltejs/kit";
import {dev} from "$app/environment";

// Temporary helper to hide in-development pages from production

// Source: https://stackoverflow.com/a/73638129
// Source: https://stackoverflow.com/a/68074574

if (!dev) {
	error(404, "Not Found");
}

export const prerender = false;
export const ssr = false;
export const csr = false;
