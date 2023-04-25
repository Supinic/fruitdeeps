export function modifyAttackSpeed () {
	return 4;
}

export function isApplied (dps, player) {
	if (player.equipment.weapon.name !== "Harmonised nightmare staff") {
		return false;
	}

	return (dps.vertex === "Magic" && player.spell);
}
