export function modifyAccuracyRoll (roll, dps, player, monster) {
	return roll + Math.floor(roll * Math.floor(monster.invocation / 5) * 2) / 100;
}

export function isApplied (dps, player, monster) {
	return (typeof monster.invocation === "number");
}
