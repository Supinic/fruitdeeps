export function modifyAccuracy (roll, dps, player, monster) {
	const cap = (monster.attributes.includes("xerician")) ? 350 : 250;
	const magic = Math.min(Math.max(monster.stats.mage, monster.stats.amagic), cap);
	const mult = 140 + Math.floor((3 * magic - 10) / 100) - Math.floor((3 * magic / 10 - 100) ** 2 / 100);

	return Math.floor(roll * Math.min(mult, 140) / 100);
}

export function modifyMaxHit (maxHit, dps, player, monster) {
	const cap = (monster.attributes.includes("xerician")) ? 350 : 250;
	const magic = Math.min(Math.max(monster.stats.mage, monster.stats.amagic), cap);
	const mult = 250 + Math.floor((3 * magic - 14) / 100) - Math.floor((3 * magic / 10 - 140) ** 2 / 100);

	return Math.floor(maxHit * mult / 100);
}

export function isApplied (dps, player) {
	return (player.equipment.weapon.name === "Twisted bow");
}
