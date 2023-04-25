const amuletList = ["Salve amulet", "Salve amulet (e)", "Salve amulet(i)", "Salve amulet(ei)"];
const meleeOnlyAmuletList = ["Salve amulet", "Salve amulet (e)"];

const regularMultiplier = 1 + (1 / 6);
const regularMagicMultiplier = 1.15;
const enhancedMultiplier = 1.20;

const getMultiplier = (dps, player) => {
	const { neck } = player.extractEquipmentNames(false, "neck");
	if (neck.includes("(e")) {
		return enhancedMultiplier;
	}

	return (dps.vertex === "Magic") ? regularMagicMultiplier : regularMultiplier;
};

export function modifyMaxHit (maxHit, dps, player) {
	return Math.floor(maxHit * getMultiplier(dps, player));
}

export function modifyAccuracy (roll, dps, player) {
	return Math.floor(roll * getMultiplier(dps, player));
}

export function modifyAdditiveMagicBonus (bonus, dps, player) {
	const multiplier = getMultiplier(dps, player);

	// Returns +20 for enhanced, +15 for regular
	return bonus + 100 * (1 - multiplier);
}

// @todo backwards check: make sure salve overrides black mask/slayer helm
export function isApplied (dps, player, monster) {
	if (!monster.attributes.includes("undead")) {
		return false;
	}

	const { neck } = player.extractEquipmentNames(false, "neck");
	if (!amuletList.includes(neck)) {
		return false;
	}
	else if (dps.vertex !== "Melee" && meleeOnlyAmuletList.includes(neck)) {
		return false;
	}

	return true;
}
