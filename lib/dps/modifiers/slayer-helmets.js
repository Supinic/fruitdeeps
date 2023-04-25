import { isApplied as isSalveApplied } from "./salve.js";

const helmList = ["Black mask", "Black mask (i)", "Slayer helmet", "Slayer helmet (i)"];
const meleeOnlyHelmList = ["Black mask", "Slayer helmet"];

const multiplier = 1 + (1 / 6);
const imbuedNonMeleeMultiplier = 1.15;

const getMultiplier = (dps) => (dps.vertex === "Melee") ? multiplier : imbuedNonMeleeMultiplier;

export function modifyMaxHit (maxHit, dps, player) {
	return Math.floor(maxHit * getMultiplier(dps, player));
}

export function modifyAccuracy (roll, dps, player) {
	return Math.floor(roll * getMultiplier(dps, player));
}

export function isApplied (dps, player, monster) {
	// If applied, salve amulet overrides black mask/slayer helmet
	if (isSalveApplied(dps, player, monster)) {
		return false;
	}
	else if (!player.misc.onTask) {
		return false;
	}

	const { helm } = player.extractEquipmentNames(false, "neck");
	if (!helmList.includes(helm)) {
		return false;
	}
	else if (dps.vertex !== "Melee" && meleeOnlyHelmList.includes(helm)) {
		return false;
	}

	return true;
}
