export function isApplied (dps, player, monster) {
	return (monster.name.includes("Nylocas Matomenos") && player.spell?.includes("Ice"));
}

export function modifyRawAccuracy (acc, dps, player) {
	const minRoll = acc.generalFormula(player.stats.magic + 9, 0);
	const maxRoll = acc.generalFormula(player.stats.magic + 9, 140);

	if (this.calcs.playerRoll >= maxRoll) {
		return 1;
	}
	else if (this.calcs.playerRoll < minRoll) {
		return 0;
	}
	else {
		return (dps.playerRoll - minRoll + 1) / (maxRoll - minRoll + 1);
	}
}
