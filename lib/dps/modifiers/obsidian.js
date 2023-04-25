const obsidianWeapons = ["Toktz-xil-ak", "Tzhaar-ket-em", "Tzhaar-ket-om", "Tzhaar-ket-om (t)", "Toktz-xil-ek"];
const necklaces = ["Berserker necklace", "Berserker necklace (or)"];

const hasWeapon = (player) => {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (obsidianWeapons.includes(weapon));
};

const hasNecklace = (player) => {
	const { neck } = player.extractEquipmentNames(false, "neck");
	return (necklaces.includes(neck));
};

const hasFullSet = (player) => {
	const equipmentNames = player.extractEquipmentNames(true, "body", "legs", "head");
	return (equipmentNames.every(i => i.startsWith("Obsidian")));
};

const armourBonus = 1.10;
const necklaceBonus = 1.20;

const getMultiplier = (player) => {
	let multiplier = 1;
	if (hasFullSet(player)) {
		multiplier *= armourBonus;
	}
	if (hasNecklace(player)) {
		multiplier *= necklaceBonus;
	}

	return multiplier;
};

export function modifyMaxHit (maxHit, dps, player) {
	return Math.floor(maxHit * getMultiplier(player));
}

export function modifyAccuracy (roll, dps, player) {
	return Math.floor(roll * getMultiplier(player));
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Melee") {
		return false;
	}
	else if (!hasWeapon(player)) {
		return false;
	}
	else if (hasNecklace(player)) {
		return true;
	}

	return hasFullSet(player);
}
