const godSpells = ["Saradomin Strike", "Flames of Zamorak", "Claws of Guthix"];

export function getFlatMaxHitBonus (extraMaxHit, dps, player) {
	if (godSpells.includes(player.spell) && player.misc.charge) {
		return extraMaxHit + 10;
	}
	else {
		return extraMaxHit + 3;
	}
}

export function isApplied (dps, player) {
	const { spell } = player;
	if (!spell) {
		return false;
	}
	else if (godSpells.includes(spell) && player.misc.charge) {
		return true;
	}

	const { hands } = player.extractEquipmentNames(false, "hands");
	return (hands === "Chaos gauntlets" && spell.includes("Bolt"));
}
