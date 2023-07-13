import { Accuracy } from "../Accuracy.js";
import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 2;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Slash");
	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const max = Math.trunc(dps.maxHit * 1.1);

	const zgsHitStore = new HitTracker();
	zgsHitStore.store([0], (1 - acc));

	for (let dmg = 0; dmg <= max; dmg++) {
		zgsHitStore.store([dmg, 25], acc / (max + 1));
	}

	dps.hitStore = zgsHitStore;
	dps.playerRoll = playerRoll;
	dps.npcRoll = npcRoll;
	dps.accuracy = acc;
	dps.rawAcc = acc;
	dps.maxHit = max;
	dps.maxHitSpec = 25;
	dps.maxList = [max];
	dps.eHealing = 25 * acc;

	return dps;
}
