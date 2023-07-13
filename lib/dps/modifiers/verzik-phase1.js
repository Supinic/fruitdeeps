import { generalFormula } from "../Accuracy.js";

/**
 * Comment by @qhps:
 * IIRC: at p1 verzik you roll your normal damage number and additionally roll a 0-10,
 * and the game then takes the lower of those two rolls.
 */

export function applyModifier (dps) {
	let capMax = 10;
	if (dps.vertex === "Ranged" || dps.vertex === "Magic") {
		capMax = 3;
	}

	dps.hitStore.redistribute(capMax, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	dps.maxHit = dps.hitStore.maxHit;
	dps.maxList = dps.hitStore.maxList;

	return dps;
}

export function modifyNpcDefenceRoll (roll, dps, player, monster) {
	if (dps.vertex !== "Magic") {
		return roll;
	}

	return generalFormula(monster.stats.def + 9, monster.stats.dmagic);
}

export function isApplied (dps, player, monster) {
	// Verzik (P1) damage cap does not apply at all to Dawnbringer
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Dawnbringer") {
		return false;
	}

	return (monster.name === "Verzik Vitur" && monster.combat === 1040);
}
