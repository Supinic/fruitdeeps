import { HitFreqStore } from "../../HitFreqStore.js";

export function applyModifier (dps, player) {
	const m1 = dps.maxHit;
	const m2 = Math.floor(dps.maxHit * 1.15);
	const acc = dps.accuracy;

	const specChance = (player.misc.kandarinHard) ? 0.11 : 0.10;
	const normalChance = (1 - specChance);

	const diamondHitStore = new HitFreqStore();
	diamondHitStore.store([0], normalChance * (1 - acc));

	for (let dmg = 0; dmg <= m1; dmg++) {
		diamondHitStore.store([dmg], acc * normalChance / (m1 + 1));
	}

	for (let dmg = 0; dmg <= m2; dmg++) {
		diamondHitStore.store([dmg], specChance / (m2 + 1));
	}

	dps.specChance = specChance;
	dps.hitStore = diamondHitStore;
	dps.rawAcc = dps.accuracy;
	dps.accuracy = specChance + (1 - specChance) * dps.accuracy;
	dps.specAcc = dps.accuracy;
	dps.maxHitSpec = m2;

	return dps;
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Diamond bolts (e)" || ammo === "Diamond dragon bolts (e)");
}
