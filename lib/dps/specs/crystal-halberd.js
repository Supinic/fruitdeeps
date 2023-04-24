import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const max = Math.trunc(dps.maxHit * 11 / 10);
	const accCalc = new Accuracy(state, dps);

	const npcRoll = accCalc.npcRoll("Slash");
	const acc1 = accCalc.compareRolls(dps.playerRoll, npcRoll);
	const acc2 = accCalc.compareRolls(Math.trunc(dps.playerRoll * 3 / 4), npcRoll);

	const challyHitStore = new HitFreqStore();

	let p1 = 0;
	let p2 = 0;
	for (let hit1 = 0; hit1 <= max; hit1++) {
		p1 = acc1 / (max + 1);
		if (hit1 === 0) {
			p1 += 1 - acc1;
		}
		for (let hit2 = 0; hit2 <= max; hit2++) {
			p2 = acc2 / (max + 1);
			if (hit2 === 0) {
				p2 += 1 - acc2;
			}
			challyHitStore.store([hit1, hit2], p1 * p2);
		}
	}

	dps.hitStore = challyHitStore;
	dps.accuracy = acc1;
	dps.rawAcc = acc1;
	dps.npcRoll = npcRoll;
	dps.maxHit = max + max;
	dps.maxList = [max, max];

	return dps;
}
