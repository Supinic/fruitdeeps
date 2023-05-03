import { spells } from "../../SpellBook.js";

export function modifyAccuracy (roll, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Smoke battlestaff") {
		return Math.floor(roll * 1.10);
	}

	return roll;
}

export function modifyMaxHit (maxHit, dps, player) {
	const { shield, weapon } = player.extractEquipmentNames(false, "shield", "weapon");
	if (shield === "Tome of fire") {
		maxHit = Math.floor(maxHit * 1.50);
	}
	if (weapon === "Smoke battlestaff") {
		maxHit = Math.floor(maxHit * 1.10);
	}

	return maxHit;
}

export function isApplied (dps, player) {
	const { spell } = player;
	if (!spell) {
		return false;
	}
	else if (!spells.standard.includes(spell)) {
		return false;
	}

	const { shield, weapon } = player.extractEquipmentNames(false, "shield", "weapon");
	if (weapon === "Smoke battlestaff") {
		return true;
	}

	return (shield === "Tome of fire" && spell.startsWith("Fire"));
}
