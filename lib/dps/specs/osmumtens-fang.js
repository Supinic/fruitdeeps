import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 1.5;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Stab");

	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const fangHitStore = new HitFreqStore();
	fangHitStore.store([0], 1 - acc);

	const min = Math.trunc(dps.maxHit * 0.15);
	for (let dmg = min; dmg <= dps.maxHit; dmg++) {
		fangHitStore.store([dmg], acc / (dps.maxHit + 1));
	}

	// Eviscerate sets the Fang's max hit to its "true max hit" for the special attack hit.
	dps.maxHitSpec = dps.maxHit;
	dps.rawAcc = acc;
	dps.accuracy = acc;
	dps.npcRoll = npcRoll;
	dps.playerRoll = playerRoll;
	dps.hitStore = fangHitStore;

	return dps;
}
