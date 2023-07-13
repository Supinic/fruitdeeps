import { HitTracker } from "../HitTracker.js";

export function apply (dps, state, options = {}) {
	const minDmg = (options.useDragonArrows) ? 8 : 5;
	const maxDmg = 48;
	const acc = dps.accuracy;
	const boost = (options.useDragonArrows) ? 15 : 13;
	const max = Math.trunc(dps.maxHit * boost / 10);

	const dbowHitStore = new HitTracker();

	dbowHitStore.store([minDmg], 1 - acc);
	for (let i = 0; i <= max; i++) {
		const dmg = Math.max(Math.min(i, maxDmg), minDmg);
		dbowHitStore.store([dmg], acc / (max + 1));
	}

	dps.maxHit = Math.min(max, maxDmg);
	dps.hitStore = dbowHitStore;
	return dps;
}
