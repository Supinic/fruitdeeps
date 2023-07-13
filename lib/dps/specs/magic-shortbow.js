import { Accuracy } from "../Accuracy.js";
import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const rangedStrBonus = state.player.bonuses[11];
	const rangedLvl = state.player.boostedStats.ranged;

	const accCalc = new Accuracy(state, dps);
	const playerRoll = Math.trunc(dps.playerRoll * 10 / 7);

	const acc = accCalc.compareRolls(playerRoll, dps.npcRoll);
	const max = Math.trunc(0.5 + (rangedLvl + 10) * (rangedStrBonus + 64) / 640);

	let p1 = 0;
	let p2 = 0;
	const msbHitStore = new HitTracker();
	for (let hit1 = 0; hit1 <= max; hit1++) {
		p1 = acc / (max + 1);
		if (hit1 === 0) {
			p1 += (1 - acc);
		}
		for (let hit2 = 0; hit2 <= max; hit2++) {
			p2 = acc / (max + 1);
			if (hit2 === 0) {
				p2 += (1 - acc);
			}
			msbHitStore.store([hit1, hit2], p1 * p2);
		}
	}

	dps.hitStore = msbHitStore;
	dps.maxList = [max, max];
	dps.maxHit = max + max;
	dps.accuracy = acc;
	dps.rawAcc = acc;

	return dps;
}
