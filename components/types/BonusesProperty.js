export const BonusesProperty = (propValue, key, componentName, location, propFullName) => {
	if (!Array.isArray(propValue)) {
		throw new Error(`Property ${propFullName} is not an array`);
	}
	else if (propValue.length !== 14) {
		throw new Error(`Property ${propFullName} is not an array of length 14`);
	}
	else if (propValue.some(i => typeof i !== "number")) {
		throw new Error(`Property ${propFullName} is not a number-only array`);
	}
};
