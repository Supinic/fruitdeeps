import { HitTracker, MultiHitTracker } from "../HitTracker.js";

export function applyModifier (dps, player, monster) {
	const acc = dps.accuracy;
	const maxHit = dps.maxHit;

	let scytheHitStore;
	if (monster.size === 2) {
		scytheHitStore = new MultiHitTracker(2).setZeroAccuracy(acc);

		for (let dmg = 0; dmg <= maxHit; dmg++) {
			scytheHitStore.store([dmg, Math.floor(dmg / 2)], (acc / (maxHit + 1)));
		}
	}
	else if (monster.size >= 3) {
		scytheHitStore = new MultiHitTracker(3).setZeroAccuracy(acc);

		for (let dmg = 0; dmg <= maxHit; dmg++) {
			scytheHitStore.store([dmg, Math.floor(dmg / 2), Math.floor(dmg / 4)], (acc / (maxHit + 1)));
		}
	}
	else {
		scytheHitStore = new HitTracker().createBasicDistribution(maxHit, acc);
	}

	dps.hitStore = scytheHitStore;
	dps.maxList = scytheHitStore.maxList;
	dps.maxHit = scytheHitStore.maxHit;

	return dps;
}

export function isApplied (dps, player) {
	// Includes all the ornamental versions from HM TOB, e.g. `Holy scythe of vitur`, etc.
	// This also includes the weaker, uncharged versions
	return (player.equipment.weapon.name.toLowerCase().includes("scythe of vitur"));
}
