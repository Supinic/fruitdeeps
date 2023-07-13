import { HitTracker } from "../HitTracker.js";

export function applyModifier (dps) {
	const hitList = dps.hitStore.getFreqs();
	const dbowHitStore = new HitTracker();

	for (let i = 0; i < hitList.length; i++) {
		for (let j = 0; j < hitList.length; j++) {
			dbowHitStore.store([hitList[i].dmg[0], hitList[j].dmg[0]], hitList[i].p * hitList[j].p);
		}
	}

	dps.hitStore = dbowHitStore;
	dps.maxList = [dps.maxHit, dps.maxHit];
	dps.maxHit = dps.maxHit + dps.maxHit;

	return dps;
}

export function isApplied (dps, player) {
	// Includes all the ornamental versions from LMS, e.g. `Dark bow (Yellow)`, etc.
	return (player.equipment.weapon.name.startsWith("Dark bow"));
}
