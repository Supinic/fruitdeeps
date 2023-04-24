import { Accuracy } from "../Accuracy.js";

export function apply (dps, state) {
	const playerRoll = Math.trunc(dps.playerRoll * 1.5);
	const accCalc = new Accuracy(state, dps);
	const acc = accCalc.compareRolls(playerRoll, dps.npcRoll);

	dps.accuracy = acc;
	dps.rawAcc = acc;

	return dps;
}
