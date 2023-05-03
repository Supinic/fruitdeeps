import { generalFormula } from "../Accuracy.js";

export function isApplied (dps, player, monster) {
	return (monster.name.includes("Nylocas Matomenos") && player.spell?.includes("Ice"));
}

// @todo make the round method a utils method somewhere
const round = (num, places) => Math.trunc(num * (10 ** places)) / (10 ** places);

export function changeAttackRoll (acc, dps, player) {
	const minRoll = generalFormula(player.stats.magic + 9, 0);
	const maxRoll = generalFormula(player.stats.magic + 9, 140);

	if (dps.playerRoll >= maxRoll) {
		return 1;
	}
	else if (dps.playerRoll < minRoll) {
		return 0;
	}
	else {
		// Round accuracy to 2 decimal places as a percentage = equivalent to 4 decimal places when in interval <0, 1>.
		return round((dps.playerRoll - minRoll + 1) / (maxRoll - minRoll + 1), 4);
	}
}
