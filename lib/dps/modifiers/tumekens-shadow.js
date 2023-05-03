import { isApplied as isToaApplied } from "./tombs-of-amascut.js";

export function determineBaseMaxHit (dps, player) {
	return Math.floor(player.boostedStats.magic / 3) + 1;
}

export function modifyEffectiveStrengthLevel (bonus, dps, player, monster) {
	// The magic damage increase is capped at a total of 100% Magic Strength
	return (isToaApplied(dps, player, monster))
		? Math.min(100, bonus * 4)
		: Math.min(100, bonus * 3);
}

export function modifyPlayerBonus (playerBonus, dps, player, monster) {
	return (isToaApplied(dps, player, monster))
		? playerBonus * 4
		: playerBonus * 3;
}

export function isApplied (dps, player) {
	// Only grants passive Magic Attack and Damage bonuses to its built-in spell, not to other spells.
	if (dps.vertex !== "Magic" || player.spell) {
		return false;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (weapon === "Tumeken's shadow");
}
