import { strictEqual } from "assert";

const round = (num, places) => Math.round(num * (10 ** places)) / (10 ** places);

export function isObject (item) {
	return (item && typeof item === "object" && !Array.isArray(item));
}

export function assertRounded (actual, expected, places, message) {
	if (typeof actual !== "number" || typeof expected !== "number") {
		throw new Error("Cannot use non-numbers in assertApproximate");
	}
	else if (typeof places !== "number") {
		throw new Error("Decimal places must be provided and be a number");
	}
	else if (places < 0 || !Number.isSafeInteger(places)) {
		throw new Error("Decimal places must be a positive integer");
	}

	const actualRounded = round(actual, places);
	const expectedRounded = round(expected, places);
	strictEqual(actualRounded, expectedRounded, `${message} (raw: ${actual} vs. ${expected})`);
}

export function mergeDeep (target, source) {
	const result = structuredClone(target ?? {});

	for (const key of Object.keys(source)) {
		if (isObject(source[key])) {
			result[key] = mergeDeep(result[key], source[key]);
		}
		else {
			result[key] = source[key];
		}
	}

	return result;
}
