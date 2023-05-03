// Leaf-bladed spear and sword do not have a bonus multiplier
const allowedWeapons = ["Leaf-bladed battleaxe"];
const multiplier = 1.175;

export function modifyMaxHit (maxHit) {
	return Math.floor(maxHit * multiplier);
}

export function isApplied (dps, player, monster) {
	if (dps.vertex !== "Melee") {
		return false;
	}
	else if (!monster.attributes.includes("leafy")) {
		return false;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return allowedWeapons.includes(weapon);
}
