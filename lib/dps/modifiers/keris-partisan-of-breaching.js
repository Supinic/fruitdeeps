const multiplier = (4 / 3);
export function modifyAccuracy (roll) {
	return Math.floor(roll * multiplier);
}

export function isApplied (dps, player, monster) {
	return (monster.attributes.includes("kalphite") && player.equipment.weapon.name === "Keris partisan of breaching");
}
