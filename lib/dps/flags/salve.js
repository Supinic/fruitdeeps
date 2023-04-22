const amuletList = ["Salve amulet", "Salve amulet (e)", "Salve amulet(i)", "Salve amulet(ei)"];
const meleeOnlyAmuletList = ["Salve amulet", "Salve amulet (e)"];

export function getFlags (dps, player, monster) {
	const { attributes } = monster;
	if (!attributes.includes("monster")) {
		return [];
	}

	const { neck } = player.extractEquipmentNames(false, "neck");
	if (!amuletList.includes(neck)) {
		return [];
	}

	if (dps.vertex !== "Melee" && meleeOnlyAmuletList.includes(neck)) {
		return [];
	}

	return [neck];
}
