const eligibleWeapons = ["Toktz-xil-ak", "Tzhaar-ket-em", "Tzhaar-ket-om", "Tzhaar-ket-om (t)", "Toktz-xil-ek"];

export function getFlags (dps, player) {
	if (dps.vertex !== "Melee") {
		return [];
	}

	const equipmentNames = player.extractEquipmentNames(true, "body", "legs", "head");
	if (equipmentNames.some(i => !i.startsWith("Obsidian"))) {
		return [];
	}

	const { neck, weapon } = player.extractEquipmentNames(false, "neck", "weapon");
	if (!eligibleWeapons.includes(weapon)) {
		return [];
	}

	const flagList = ["Obsidian armour"];
	if (neck.startsWith("Berserker necklace")) {
		flagList.push("Berserker necklace");
	}

	return flagList;
}
