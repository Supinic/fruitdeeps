import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const strBonus = state.player.bonuses[11];
	const rangedLvl = state.player.boostedStats.ranged;

	const acc = 1;
	const max = Math.trunc(0.5 + (rangedLvl + 10) * (strBonus + 64) / 640);

	const mlbHitStore = new HitTracker();
	for (let hit = 0; hit <= max; hit++) {
		mlbHitStore.store([hit], 1 / (max + 1));
	}

	dps.hitStore = mlbHitStore;
	dps.maxList = [max];
	dps.maxHit = max;
	dps.accuracy = acc;
	dps.rawAcc = acc;

	return dps;
}
