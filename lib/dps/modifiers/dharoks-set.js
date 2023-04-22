// Dharok's set effect: Raises your damage according to your hp, after the damage roll

import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps, player) {
	const currentHp = player.misc.currentHitpoints;
	const baseHp = player.stats.hitpoints;
	const acc = dps.accuracy;

	const hpMult = Math.max(1, 1 + (baseHp - currentHp) * baseHp / 10000);
	const oldMax = dps.maxHit;
	const max = Math.floor(dps.maxHit * hpMult);

	const dharokStore = new HitFreqStore();
	dharokStore.store([0], 1 - acc);

	for (let dmg = 0; dmg <= oldMax; dmg++) {
		dharokStore.store([Math.trunc(dmg * hpMult)], acc / (oldMax + 1));
	}

	dps.maxList = [max];
	dps.hitStore = dharokStore;
	dps.maxHit = max;

	return dps;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Melee") {
		return false;
	}

	const equipment = player.extractEquipmentNames(true, "head", "body", "legs", "weapon");
	return (equipment.every(i => i.startsWith("Dharok's")));
}
