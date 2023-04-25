import { isApplied as isToaApplied } from "./tombs-of-amascut.js";

export function determineBaseMaxHit (player) {
	return Math.floor(player.boostedStats.magic / 3) + 1;
}

export function modifyEffectiveStrengthLevel (bonus, dps, player, monster) {
	if (isToaApplied(dps, player, monster)) {
		return Math.min(100, bonus * 4);
	}
	else {
		return Math.min(100, bonus * 3);
	}
}

export function modifyPlayerBonus (playerBonus, dps, player, monster) {
	if (isToaApplied(dps, player, monster)) {
		return playerBonus * 4;
	}
	else {
		return playerBonus * 3;
	}
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Magic" || player.spell) {
		return false;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (weapon === "Tumeken's shadow");
}
