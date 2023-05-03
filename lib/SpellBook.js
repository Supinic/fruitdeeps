const standardElements = ["Wind", "Water", "Earth", "Fire"];
const standardTiers = ["Strike", "Bolt", "Blast", "Wave", "Surge"];
const ancientElements = ["Smoke", "Shadow", "Blood", "Ice"];
const ancientTiers = ["Rush", "Burst", "Blitz", "Barrage"];

const spellList = {
	standard: [],
	ancient: [],
	special: [
		"Iban Blast",
		"Magic Dart",
		"Saradomin Strike",
		"Flames of Zamorak",
		"Claws of Guthix",
		"Crumble Undead"
	]
};

for (const element of standardElements) {
	for (const tier of standardTiers) {
		spellList.standard.push(`${element} ${tier}`);
	}
}

for (const element of ancientElements) {
	for (const tier of ancientTiers) {
		spellList.ancient.push(`${element} ${tier}`);
	}
}

const maxLookupTable = {
	"Wind Strike": 2,
	"Water Strike": 4,
	"Earth Strike": 6,
	"Fire Strike": 8,

	"Wind Bolt": 9,
	"Water Bolt": 10,
	"Earth Bolt": 11,
	"Fire Bolt": 12,

	"Wind Blast": 13,
	"Water Blast": 14,
	"Earth Blast": 15,
	"Fire Blast": 16,

	"Wind Wave": 17,
	"Water Wave": 18,
	"Earth Wave": 19,
	"Fire Wave": 20,

	"Wind Surge": 21,
	"Water Surge": 22,
	"Earth Surge": 23,
	"Fire Surge": 24,

	"Smoke Rush": 14,
	"Shadow Rush": 15,
	"Blood Rush": 16,
	"Ice Rush": 17,

	"Smoke Burst": 18,
	"Shadow Burst": 19,
	"Blood Burst": 21,
	"Ice Burst": 22,

	"Smoke Blitz": 23,
	"Shadow Blitz": 24,
	"Blood Blitz": 25,
	"Ice Blitz": 26,

	"Smoke Barrage": 27,
	"Shadow Barrage": 28,
	"Blood Barrage": 29,
	"Ice Barrage": 30,

	"Iban Blast": 25,
	"Magic Dart": 0,
	"Saradomin Strike": 20,
	"Flames of Zamorak": 20,
	"Claws of Guthix": 20,
	"Crumble Undead": 15
};

export const spells = spellList;

export function hasFlatMaxHit (spell) {
	const spellMaxHit = maxLookupTable[spell];
	if (typeof spellMaxHit !== "number") {
		throw new Error(`Unknown spell found: ${spell}`);
	}

	return (spellMaxHit !== 0);
}

export class SpellBook {
	getSpellList () {
		return spellList;
	}

	maxLookup (spell) {
		if (typeof maxLookupTable[spell] !== "number") {
			throw new Error(`Unknown spell found: ${spell}`);
		}

		return maxLookupTable[spell];
	}

	tierObject (spellName) {
		// Takes in a spellName and returns an object that breaks down specifics of the spell.
		const spellObj = {
			spellBook: "standard",
			special: null,
			element: null,
			tier: null
		};

		if (spellName === null) {
			return spellObj;
		}

		for (const spell of spellList.special) {
			if (spellName === spell) {
				spellObj.spellBook = "special";
				spellObj.special = spell;
			}
		}

		for (const element of standardElements) {
			if (spellName.includes(element)) {
				spellObj.element = element;
			}
		}

		for (const tier of standardTiers) {
			if (spellName.includes(tier)) {
				spellObj.tier = tier;
			}
		}

		for (const element of ancientElements) {
			if (spellName.includes(element)) {
				spellObj.element = element;
				spellObj.spellBook = "ancient";
			}
		}

		for (const tier of ancientTiers) {
			if (spellName.includes(tier)) {
				spellObj.tier = tier;
				spellObj.spellBook = "ancient";
			}
		}

		return spellObj;
	}
}
