import { generalFormula } from "../Accuracy.js";

export function applyModifier () {}

export function modifyMaxHit (maxHit, dps, player) {
	if (dps.vertex === "Melee" || dps.vertex === "Ranged") {
		return Math.floor(maxHit / 3);
	}

	const { spell } = player;
	if (spell && (spell.includes("Fire") || spell.includes("Flame"))) {
		return Math.floor(maxHit * 1.50);
	}

	return maxHit;
}

export function modifyAccuracyRoll (roll, dps, player, monster) {
	return generalFormula(monster.stats.def + 9, monster.stats.dmagic);
}

export function isApplied (dps, player, monster) {
	return (monster.name === "Guardian");
}
