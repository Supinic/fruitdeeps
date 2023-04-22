const headList = ["Black mask", "Black mask (i)", "Slayer helmet", "Slayer helmet (i)"];

export function getFlags (dps, player) {
	const { onTask } = player.misc;
	if (!onTask) {
		return [];
	}

	const head = player.equipment.head.name;
	if (!headList.includes(head)) {
		return [];
	}
	else if (head.endsWith("(i)")) {
		return ["Black mask (i)"];
	}
	// If the mask/helmet isn't imbued, its bonuses only apply if the player uses melee attacks
	else if (dps.vertex === "Melee") {
		return ["Black mask"];
	}

	return [];
}
