const accuracyBonus = {
	head: 0.05,
	body: 0.15,
	legs: 0.10
};
const damageBonus = {
	head: 0.025,
	body: 0.075,
	legs: 0.05
};

// Source for affected weapons: {@link https://oldschool.runescape.wiki/w/Crystal_equipment#Crystal_armour}
const armourList = ["Crystal helm", "Crystal body", "Crystal legs"];
const weaponList = ["Crystal bow", "Bow of faerdhinen"];

const getCrystalPieces = (player) => {
	const result = {};
	const equipment = player.extractEquipmentNames(false, "body", "head", "legs");
	for (const [slot, name] of Object.entries(equipment)) {
		result[slot] = (armourList.includes(name));
	}

	return result;
};

export function modifyMaxHit (maxHit, dps, player) {
	let multiplier = 1;
	const pieces = getCrystalPieces(player);
	for (const [slot, hasCrystal] of Object.entries(pieces)) {
		if (hasCrystal) {
			multiplier += damageBonus[slot];
		}
	}

	return Math.floor(maxHit * multiplier);
}

export function modifyAccuracy (roll, dps, player) {
	let multiplier = 1;
	const pieces = getCrystalPieces(player);
	for (const [slot, hasCrystal] of Object.entries(pieces)) {
		if (hasCrystal) {
			multiplier += accuracyBonus[slot];
		}
	}

	return Math.floor(roll * multiplier);
}

export function isApplied (dps, player) {
	if (!dps.vertex !== "Ranged") {
		return false;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (!weaponList.includes(weapon)) {
		return false;
	}

	// Return true if player has at least one crystal armour piece equipped
	const pieces = getCrystalPieces(player);
	return (Object.values(pieces).some(Boolean));
}
