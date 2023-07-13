import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const max = Math.trunc(dps.maxHit * 3 / 2);
	const acc = dps.accuracy;

	const def = state.monster.stats.def;
	const monsterName = state.monster.name;

	const dwhHitStore = new HitTracker();
	dwhHitStore.store([0], 1 - acc);

	let eDefReduction = 0;
	if (monsterName === "Tekton") {
		eDefReduction += Math.trunc(def / 10) * (1 - acc);
	}

	eDefReduction += Math.trunc(def * 3 / 10) * acc;

	for (let dmg = 0; dmg <= max; dmg++) {
		dwhHitStore.store([dmg], acc / (max + 1));
	}

	dps.hitStore = dwhHitStore;
	dps.eDefReduction += eDefReduction;
	dps.maxList = [max];
	dps.maxHit = max;

	return dps;
}
