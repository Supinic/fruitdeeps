import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps) {
	const acc = dps.accuracy;
	const newMax = Math.floor(dps.maxHit * 133 / 100);
	const specMax = dps.maxHit * 3;

	const kerisHitStore = new HitFreqStore();
	kerisHitStore.store([0], 1 - acc);

	// (50/51) chance to land a normal attack
	for (let h1 = 0; h1 <= newMax; h1 += 1) {
		kerisHitStore.store([h1], acc * 50 / 51 / (newMax + 1));
	}

	// (1/51) chance to land a special proc, dealing 300% of the regular damage roll
	for (let h2 = 0; h2 <= dps.maxHit; h2 += 1) {
		kerisHitStore.store([h2 * 3], acc / 51 / (dps.maxHit + 1));
	}

	dps.maxList = [newMax];
	dps.maxHit = newMax;
	dps.maxHitSpec = specMax;
	dps.hitStore = kerisHitStore;

	return dps;
}

export function isApplied (dps, player, monster) {
	return (monster.attributes.includes("kalphite"));
}
