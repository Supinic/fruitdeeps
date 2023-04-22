import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps) {
	const max = Math.trunc(dps.maxHit * 3 / 2);
	const acc = dps.accuracy;

	const blowpHitStore = new HitFreqStore();
	blowpHitStore.store([0], 1 - acc);

	let eHealing = 0;
	for (let dmg = 0; dmg <= max; dmg++) {
		blowpHitStore.store([dmg], acc / (max + 1));
		eHealing += Math.trunc(dmg / 2) * acc / (max + 1);
	}

	dps.hitStore = blowpHitStore;
	dps.maxList = [max];
	dps.maxHit = max;
	dps.eHealing += eHealing;

	return dps;
}
