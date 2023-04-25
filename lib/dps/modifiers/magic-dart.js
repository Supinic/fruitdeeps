export function determineBaseMaxHit (player) {
	const { magic } = player.boostedStats;
	const { weapon } = player.extractEquipmentNames(false, "weapon");

	if (weapon === "Slayer's staff (e)") {
		return Math.floor(magic / 6) + 13;
	}
	else {
		return Math.floor(magic / 10) + 10;
	}
}

export function isApplied (dps, player) {
	return (player.spell === "Magic Dart");
}
