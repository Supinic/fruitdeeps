// Karil's set effect: 25% chance of an extra hit that deals up to 50% of regular max hit
import { HitTracker } from "../HitTracker.js";

const procChance = 0.25;
const normalChance = (1 - procChance);

export function applyModifier (dps) {
	const acc = dps.accuracy;
	const m1 = dps.maxHit;
	const m2 = Math.floor(dps.maxHit / 2);

	const karilsHitStore = new HitTracker();
	karilsHitStore.store([0], 1 - acc);

	for (let dmg = 0; dmg <= m1; dmg++) {
		karilsHitStore.store([dmg], normalChance * acc / (m1 + 1));
		karilsHitStore.store([dmg, Math.floor(dmg / 2)], procChance * acc / (m1 + 1));
	}

	dps.hitStore = karilsHitStore;
	dps.maxList = [m1, m2];
	dps.maxHit = m1 + m2;
	return dps;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Ranged") {
		return false;
	}

	const { ammo, neck } = player.extractEquipmentNames(false, "ammo", "neck");
	if (ammo !== "Bolt rack" || !neck.startsWith("Amulet of the damned")) {
		return false;
	}

	const equipment = player.extractEquipmentNames(true, "head", "body", "legs", "weapon");
	return (equipment.every(i => i.startsWith("Karil's")));
}
