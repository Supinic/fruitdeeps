export function modifyAccuracy (roll, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Smoke battlestaff") {
		return Math.floor(roll * 1.10);
	}

	return roll;
}

export function modifyMaxHit (maxHit, dps, player) {
	const { shield } = player.extractEquipmentNames(false, "shield");
	if (shield === "Tome of fire") {
		return Math.floor(maxHit * 1.50);
	}

	return maxHit;
}

export function modifyAdditiveMagicBonus (bonus, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Smoke battlestaff") {
		return 10;
	}

	return 0;
}

export function isApplied (dps, player) {
	const { spell } = player;
	if (!spell) {
		return false;
	}

	const { shield } = player.extractEquipmentNames(false, "shield");
	if (shield === "Tome of fire" && spell.startsWith("Fire")) {
		return true;
	}

	const { hands } = player.extractEquipmentNames(false, "hands");
	return (hands === "Chaos gauntlets" && spell.includes("Bolt"));
}
