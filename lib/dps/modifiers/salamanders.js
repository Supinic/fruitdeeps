import { generalFormula } from "../MaxHit.js";
const salamanderBonuses = {
	"Black salamander": 92,
	"Red salamander": 77,
	"Orange salamander": 59,
	"Swamp lizard": 56
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

export function determineBaseMaxHit (player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return generalFormula(salamanderBonuses[weapon]);
}

const supportedWeapons = Object.keys(salamanderBonuses);
export function isApplied (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (supportedWeapons.includes(weapon));
}
