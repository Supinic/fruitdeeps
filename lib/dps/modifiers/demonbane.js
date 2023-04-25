// Source on Holy water bonuses: {@link https://twitter.com/JagexAsh/status/1569278023014170624}
// Archive of above source: {@link https://archive.ph/uIi2l}

const allowedVertices = {
	Melee: ["Silverlight", "Darklight", "Arclight"],
	Ranged: ["Holy water"],
	Magic: []
};

const bonuses = {
	Silverlight: { acc: 1.60, dmg: 1 },
	Darklight: { acc: 1.60, dmg: 1 },
	Arclight: { acc: 1.70, dmg: 1.70 },
	"Holy water": { acc: 1, dmg: 1.60 }
};

export function modifyMaxHit (maxHit, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return Math.floor(maxHit * bonuses[weapon].dmg);
}

export function modifyAccuracy (roll, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return Math.floor(roll * bonuses[weapon].acc);
}

export function getFlatMaxHitBonus (extraMaxHit, dps, player, monster) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Holy water" && monster.name === "Nezikchened") {
		return extraMaxHit + 5;
	}

	return extraMaxHit;
}

export function isApplied (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return allowedVertices[dps.vertex].includes(weapon);
}
