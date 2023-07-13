import { Accuracy } from "../Accuracy.js";
import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const accCalc = new Accuracy(state, dps);

	const playerRoll = dps.playerRoll;
	const npcRoll = dps.npcRoll;
	const max = dps.maxHit;

	const newPRoll = playerRoll * 2;

	const acc = accCalc.compareRolls(newPRoll, npcRoll);

	const acbHitStore = new HitTracker();
	acbHitStore.store([0], 1 - acc);

	for (let i = 0; i <= max; i++) {
		acbHitStore.store([i], acc / (max + 1));
	}

	dps.hitStore = acbHitStore;
	dps.accuracy = acc;
	dps.rawAcc = acc;
	dps.playerRoll = newPRoll;

	return dps;
}
