import { HitFreqStore } from "../../HitFreqStore.js";

const baseSpecChance = 0.11;

export function applyModifier (dps, player) {
	const acc = dps.accuracy;
	const onyxHitStore = new HitFreqStore();
	onyxHitStore.store([0], 1 - acc);

	const specChance = (player.misc.kandarinHard) ? (baseSpecChance * 1.10) : baseSpecChance;
	const normalChance = (1 - specChance);

	const m1 = dps.maxHit;
	for (let dmg = 0; dmg <= m1; dmg++) {
		onyxHitStore.store([dmg], acc * normalChance / (m1 + 1));
	}

	const m2 = Math.floor(dps.maxHit * 1.20);
	for (let dmg = 0; dmg <= m2; dmg++) {
		onyxHitStore.store([dmg], acc * specChance / (m2 + 1));
	}

	dps.hitStore = onyxHitStore;
	dps.maxHitSpec = m2;

	return dps;
}

export function isApplied (dps, player, monster) {
	if (monster.attributes.includes("undead")) {
		return false;
	}

	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Onyx bolts (e)" || ammo === "Onyx dragon bolts (e)");
}
