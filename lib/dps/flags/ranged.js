const rangedWildernessWeapons = ["Craw's bow", "Webweaver"];

export function getFlags (dps, player) {
	if (dps.vertex !== "Ranged") {
		return [];
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (player.misc.wilderness && rangedWildernessWeapons.includes(weapon)) {
		return ["Craw's bow"];
	}

	return [];
}
