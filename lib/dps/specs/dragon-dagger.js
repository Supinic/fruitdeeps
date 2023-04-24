import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const accCalc = new Accuracy(state, dps);

	const pRoll = Math.trunc(dps.playerRoll * 23 / 20);
	const npcRoll = accCalc.npcRoll("Slash");
	const max = Math.trunc(dps.maxHit * 23 / 20);

	const acc = accCalc.compareRolls(pRoll, npcRoll);
	const ddsHitStore = new HitFreqStore();

	let p1 = 0;
	let p2 = 0;
	for (let hit1 = 0; hit1 <= max; hit1++) {
		p1 = acc / (max + 1);
		if (hit1 === 0) {
			p1 += 1 - acc;
		}
		for (let hit2 = 0; hit2 <= max; hit2++) {
			p2 = acc / (max + 1);
			if (hit2 === 0) {
				p2 += 1 - acc;
			}
			ddsHitStore.store([hit1, hit2], p1 * p2);
		}
	}

	dps.hitStore = ddsHitStore;
	dps.rawAcc = acc;
	dps.accuracy = acc;
	dps.playerRoll = pRoll;
	dps.npcRoll = npcRoll;
	dps.maxList = [max, max];
	dps.maxHit = max + max;

	return dps;
}
