import { generalFormula } from "../Accuracy.js";

export function modifyAccuracyRoll (roll, dps, player, monster) {
	return generalFormula(monster.stats.def + 9, monster.stats.dmagic);
}

export function isApplied (dps, player, monster) {
	return (monster.name === "Verzik Vitur" && monster.combat > 1040);
}
