const allowedVertices = {
	Melee: ["Dragon hunter lance"],
	Ranged: ["Dragon hunter crossbow"],
	Magic: []
};

const weaponBonuses = {
	"Dragon hunter lance": {
		accuracy: 1.20,
		damage: 1.20
	},
	"Dragon hunter crossbow": {
		accuracy: 1.30,
		damage: 1.25
	}
};

export function modifyMaxHit (maxHit, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return Math.floor(maxHit * weaponBonuses[weapon].damage);
}

export function modifyAccuracy (roll, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return Math.floor(roll * weaponBonuses[weapon].accuracy);
}

export function isApplied (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return allowedVertices[dps.vertex].includes(weapon);
}
