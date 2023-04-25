const bonus = {
	head: 0.005,
	body: 0.005,
	legs: 0.005
};
const fullSetBonus = 0.01;

const armourList = ["Inquisitor's great helm", "Inquisitor's hauberk", "Inquisitor's plateskirt"];

const getInquisitorPieces = (player) => {
	const result = {};
	const equipment = player.extractEquipmentNames(false, "body", "head", "legs");
	for (const [slot, name] of Object.entries(equipment)) {
		result[slot] = (armourList.includes(name));
	}

	return result;
};

const hasFullSet = (pieces) => (Object.values(pieces).filter(Boolean).length === armourList.length);

const getMultiplier = (player) => {
	let multiplier = 1;
	const pieces = getInquisitorPieces(player);
	for (const [slot, hasInquis] of Object.entries(pieces)) {
		if (hasInquis) {
			multiplier += bonus[slot];
		}
	}

	if (hasFullSet(pieces)) {
		multiplier += fullSetBonus;
	}

	return multiplier;
};

export function modifyMaxHit (maxHit, dps, player) {
	return Math.floor(maxHit * getMultiplier(player));
}

export function modifyAccuracy (roll, dps, player) {
	return Math.floor(roll * getMultiplier(player));
}

export function isApplied (dps, player) {
	// Inquisitor's set only applies to Crush melee attacks
	if (dps.vertex !== "Melee" || player.attackStyle.type !== "Crush" || player.spell) {
		return false;
	}

	// Return true if player has at least one inquisitor armour piece equipped
	const pieces = getInquisitorPieces(player);
	return (Object.values(pieces).some(Boolean));
}
