import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 2;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Slash");

	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const max = Math.trunc(dps.maxHit * 1.1);

	const sgsHitStore = new HitFreqStore();
	sgsHitStore.store([0], 1 - acc);

	let eHealing = 0;
	let ePrayer = 0;
	for (let dmg = 0; dmg <= max; dmg++) {
		sgsHitStore.store([dmg], acc / (max + 1));
		eHealing += Math.max(10, Math.trunc(dmg / 2)) * acc / (max + 1);
		ePrayer += Math.max(5, Math.trunc(dmg / 4)) * acc / (max + 1);
	}

	dps.eHealing += eHealing;
	dps.ePrayer += ePrayer;
	dps.maxHit = max;
	dps.maxList = [max];
	dps.rawAcc = acc;
	dps.accuracy = acc;
	dps.hitStore = sgsHitStore;
	dps.npcRoll = npcRoll;
	dps.playerRoll = playerRoll;

	return dps;
}
