// Ahrim's set effect: 25% chance to raise your max hit by 30%
import { HitFreqStore } from "../HitFreqStore.js";

const procChance = 0.25;
const normalChance = (1 - procChance);

export function applyModifier (dps) {
	const m1 = dps.maxHit;
	const m2 = Math.floor(dps.maxHit * 1.30);
	const acc = dps.accuracy;

	const ahrimsHitStore = new HitFreqStore();
	ahrimsHitStore.store([0], 1 - acc);

	for (let dmg = 0; dmg <= m1; dmg++) {
		ahrimsHitStore.store([dmg], normalChance * acc / (m1 + 1));
	}
	for (let dmg = 0; dmg <= m2; dmg++) {
		ahrimsHitStore.store([dmg], procChance * acc / (m2 + 1));
	}

	dps.hitStore = ahrimsHitStore;
	dps.maxHitSpec = m2;

	return dps;
}

export function isApplied (dps, player) {
	if (!player.spell) {
		return false;
	}

	const { neck } = player.extractEquipmentNames(false, "ammo", "neck");
	if (!neck.includes("Amulet of the damned")) {
		return false;
	}

	const equipment = player.extractEquipmentNames(true, "head", "body", "legs", "weapon");
	return (equipment.every(i => i.startsWith("Ahrim's")));
}
