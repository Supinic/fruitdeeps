export function getFlags (dps, player) {
	const equipmentNames = player.extractEquipmentNames(true, "head", "hands", "body", "legs");
	if (equipmentNames.some(i => !i.toLowerCase().includes("void"))) {
		return [];
	}

	const { head, body, legs } = player.extractEquipmentNames(false, "head", "body", "legs");
	const isEliteSet = (body.startsWith("Elite") && legs.startsWith("Elite"));

	// Note: {@link https://oldschool.runescape.wiki/w/Void_melee_helm}
	// Oddly enough, the void melee helm is the only Void Knight helmet that doesn't have any additional benefit from having Elite Void.
	if (head.includes("Void melee helm") && dps.vertex === "Melee") {
		return ["Void melee"];
	}
	else if (head.includes("Void ranger helm") && dps.vertex === "Ranged") {
		return (isEliteSet) ? ["Elite void range"] : ["Void range"];
	}
	else if (head.includes("Void ranger helm") && dps.vertex === "Mage") {
		return (isEliteSet) ? ["Elite void mage"] : ["Void mage"];
	}

	return [];
}
