import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	// 10% damage boost for Crystal/Dragon Halberd special attack
	const max = Math.trunc(dps.maxHit * 1.10);
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Slash");

	const acc1 = accCalc.compareRolls(dps.playerRoll, npcRoll);
	// Second hit has a 25% reduced accuracy roll
	const acc2 = accCalc.compareRolls(Math.trunc(dps.playerRoll * 0.75), npcRoll);

	const challyHitStore = new HitFreqStore();

	let p1 = 0;
	let p2 = 0;
	for (let hit1 = 0; hit1 <= max; hit1++) {
		p1 = acc1 / (max + 1);
		if (hit1 === 0) {
			p1 += 1 - acc1;
		}

		// Halberds only hit twice if the target is 2x2 size or larger
		if (state.monster.size > 1) {
			for (let hit2 = 0; hit2 <= max; hit2++) {
				p2 = acc2 / (max + 1);
				if (hit2 === 0) {
					p2 += 1 - acc2;
				}

				challyHitStore.store([hit1, hit2], p1 * p2);
			}
		}
		else {
			challyHitStore.store([hit1], p1);
		}
	}

	dps.hitStore = challyHitStore;
	dps.accuracy = acc1;
	dps.rawAcc = acc1;
	dps.npcRoll = npcRoll;

	if (state.monster.size === 1) {
		dps.maxHit = max;
		dps.maxList = [max];
	}
	else {
		// Halberds only hit twice if the target is 2x2 size or larger
		dps.maxHit = max + max;
		dps.maxList = [max, max];
	}

	return dps;
}
