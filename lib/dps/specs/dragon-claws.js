import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const accCalc = new Accuracy(state, dps);
	const max = dps.maxList[0];

	const npcRoll = accCalc.npcRoll("Slash");
	const acc = accCalc.compareRolls(dps.playerRoll, npcRoll);
	// const trueMax = (max - 1) + Math.trunc((max - 1) / 2) + 2 * Math.trunc((max - 1) / 4) + 1;

	const clawHitStore = new HitFreqStore();

	// distribution of first successful roll
	const max1 = max - 1;
	const min1 = Math.trunc(max / 2);
	for (let dmg = min1; dmg <= max1; dmg++) {
		// let dmgAll = dmg + Math.trunc(dmg / 2) + 2 * Math.trunc(dmg / 4)
		// newDist[dmgAll] += acc / (max1 - min1 + 1) / 2
		// newDist[dmgAll + 1] += acc / (max1 - min1 + 1) / 2
		clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4)], acc / (max1 - min1 + 1) / 2);
		clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4) + 1], acc / (max1 - min1 + 1) / 2);
	}
	let scalingAcc = (1 - acc);

	// distribution of second successful roll
	const max2 = Math.trunc(max * 7 / 8);
	const min2 = Math.trunc(max * 3 / 8);
	for (let dmg = min2; dmg <= max2; dmg++) {
		// let dmgAll = dmg + 2 * Math.trunc(dmg / 2)
		// newDist[dmgAll] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
		// newDist[dmgAll + 1] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
		clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2)], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
		clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2) + 1], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
	}
	scalingAcc = (1 - acc) * (1 - acc);

	// distribution of third successful roll
	const max3 = Math.trunc(max * 3 / 4);
	const min3 = Math.trunc(max * 1 / 4);
	for (let dmg = min3; dmg <= max3; dmg++) {
		// let dmgAll = 2 * dmg
		// newDist[dmgAll] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
		// newDist[dmgAll + 1] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
		clawHitStore.store([0, 0, dmg, dmg], (acc * scalingAcc) / (max3 - min3 + 1) / 2);
		clawHitStore.store([0, 0, dmg, dmg + 1], (acc * scalingAcc) / (max3 - min3 + 1) / 2);
	}
	scalingAcc = scalingAcc * (1 - acc);

	// distribution of fourth successful roll
	const max4 = Math.trunc(max * 5 / 4);
	const min4 = Math.trunc(max * 1 / 4);
	for (let dmg = min4; dmg <= max4; dmg++) {
		// let dmgAll = dmg
		// newDist[dmgAll] += (acc * scalingAcc) / (max4 - min4 + 1)
		clawHitStore.store([0, 0, 0, dmg], (acc * scalingAcc) / (max4 - min4 + 1));
	}
	scalingAcc = scalingAcc * (1 - acc);

	// newDist[0] += scalingAcc / 2
	// newDist[2] += scalingAcc / 2
	clawHitStore.store([0, 0, 0, 0], scalingAcc / 2);
	clawHitStore.store([0, 0, 1, 1], scalingAcc / 2);

	dps.hitStore = clawHitStore;
	dps.maxList = [max1, Math.trunc(max1 / 2), Math.trunc(max1 / 4), Math.trunc(max1 / 4) + 1];
	dps.accuracy = acc;
	dps.rawAcc = acc;

	return dps;
}
