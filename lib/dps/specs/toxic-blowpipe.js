import { Accuracy } from "../Accuracy.js";
import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 2;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Ranged");

	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const max = Math.trunc(dps.maxHit * 1.50);

	const blowpHitStore = new HitTracker();
	blowpHitStore.store([0], 1 - acc);

	let eHealing = 0;
	for (let dmg = 0; dmg <= max; dmg++) {
		blowpHitStore.store([dmg], acc / (max + 1));
		eHealing += Math.trunc(dmg / 2) * acc / (max + 1);
	}

	dps.maxHit = max;
	dps.maxList = [max];
	dps.rawAcc = acc;
	dps.accuracy = acc;
	dps.hitStore = blowpHitStore;
	dps.eHealing += eHealing;
	dps.npcRoll = npcRoll;
	dps.playerRoll = playerRoll;

	return dps;
}
