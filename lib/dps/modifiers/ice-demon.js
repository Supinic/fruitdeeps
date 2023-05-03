import { generalFormula } from "../Accuracy.js";

/**
 * Mechanics:
 * "The demon has damage reduction effects for all attack styles reducing damage to 33% with the exception of
 * Fire spells, it takes 50% more damage when attacked with fire spells or the Flames of Zamorak spell."
 * Article: https://oldschool.runescape.wiki/w/Ice_demon
 * Source: https://twitter.com/JagexAsh/status/1133350436554121216
 */
export function modifyMaxHit (maxHit, dps, player) {
	if (dps.vertex === "Melee" || dps.vertex === "Ranged") {
		return Math.floor(maxHit / 3);
	}

	const { spell } = player;
	if (spell && (spell.includes("Fire") || spell.includes("Flame"))) {
		return Math.floor(maxHit * 1.50);
	}

	return Math.floor(maxHit / 3);
}

/**
 * Mechanics: "(...) its magic defence being calculated from its defence level rather than magic, unlike most monsters"
 * Article: https://oldschool.runescape.wiki/w/Ice_demon
 * Source: https://twitter.com/JagexAsh/status/1101198072300875778
 */
export function modifyNpcDefenceRoll (roll, dps, player, monster) {
	if (dps.vertex !== "Magic") {
		return roll;
	}

	return generalFormula(monster.stats.def + 9, monster.stats.dmagic);
}

export function isApplied (dps, player, monster) {
	return (monster.name === "Ice demon");
}
