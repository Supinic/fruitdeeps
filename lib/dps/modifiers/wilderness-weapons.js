const vertexWeapons = {
	Ranged: ["Craw's bow", "Webweaver"],
	Melee: ["Viggora's chainmace", "Ursine chainmace"],
	Magic: ["Thammaron's sceptre", "Accursed sceptre"]
};

const bonuses = {
	Magic: { acc: 1.50, dmg: 1.50 },
	Melee: { acc: 1.50, dmg: 1.50 },
	Ranged: { acc: 1.50, dmg: 1.50 }
};

export function modifyMaxHit (maxHit, dps) {
	return Math.floor(maxHit * bonuses[dps.vertex].dmg);
}

export function modifyAccuracy (roll, dps) {
	return Math.floor(roll * bonuses[dps.vertex].acc);
}

export function modifyAdditiveMagicBonus (bonus) {
	// Should return +50
	return bonus + 100 * (1 - bonuses.Magic.dmg);
}

export function isApplied (dps, player) {
	if (!player.misc.wilderness) {
		return false;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (vertexWeapons[dps.vertex].includes(weapon));
}
