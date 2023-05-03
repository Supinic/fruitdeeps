import { generalFormula } from "../MaxHit.js";
const salamanderBonuses = {
	"Black salamander": 92,
	"Red salamander": 77,
	"Orange salamander": 59,
	"Swamp lizard": 56
};

const salamanderTars = {
	"Black salamander": "Harralander tar",
	"Red salamander": "Tarromin tar",
	"Orange salamander": "Marrentill tar",
	"Swamp lizard": "Guam tar"
};

/**
 * When using the Flare (Range) attack style, the attack speed is 4.
 * This is similar in concept to the Rapid style of most Ranged weapons.
 * Source: {@link https://oldschool.runescape.wiki/w/Salamander}
 * @param {number} speed
 * @param {Object} dps
 * @returns {number}
 */
export function modifyAttackSpeed (speed, dps) {
	if (dps.vertex === "Ranged") {
		return 4;
	}
	else {
		return 5;
	}
}

export function determineBaseMaxHit (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return generalFormula(player.boostedStats.magic, salamanderBonuses[weapon]);
}

export function modifyMaxHit (maxHit, dps, player) {
	const { weapon, ammo } = player.extractEquipmentNames(false, "weapon", "ammo");
	if (salamanderTars[weapon] !== ammo) {
		return 0; // Reduce max hit to 0 if incorrect tar is provided
	}

	return maxHit;
}

const supportedWeapons = Object.keys(salamanderBonuses);
export function isApplied (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (supportedWeapons.includes(weapon));
}
