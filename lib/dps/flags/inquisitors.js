export function getFlags (dps, player) {
	if (player.attackStyle.type !== "Crush" || player.spell) {
		return [];
	}

	const flags = [];
	const equipmentNames = player.extractEquipmentNames(true, "body", "head", "legs");
	for (const name of equipmentNames) {
		if (name.startsWith("Inquisitor's")) {
			flags.push(name);
		}
	}

	if (flags.length === equipmentNames.length) {
		return ["Inquisitor's armour set"];
	}
	else {
		return flags;
	}
}
