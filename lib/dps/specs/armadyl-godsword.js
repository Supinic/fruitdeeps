import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 2;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Slash");

	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const max = Math.trunc(dps.maxHit * 1.375);

	const agsHitStore = new HitFreqStore();
	agsHitStore.store([0], 1 - acc);

	for (let dmg = 0; dmg <= max; dmg++) {
		agsHitStore.store([dmg], acc / (max + 1));
	}

	dps.maxHit = max;
	dps.maxList = [max];
	dps.rawAcc = acc;
	dps.accuracy = acc;
	dps.hitStore = agsHitStore;
	dps.npcRoll = npcRoll;
	dps.playerRoll = playerRoll;

	return dps;
}
