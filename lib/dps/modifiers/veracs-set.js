// Verac's set effect: skips accuracy roll and adds 1 damage 25% of the time
import { HitFreqStore } from "../HitFreqStore.js";

const procChance = 0.25;
const normalChance = (1 - procChance);

export function applyModifier (dps) {
	const acc = dps.accuracy;
	const max = dps.maxHit;

	dps.maxHitSpec = dps.maxHit + 1;

	const veracHitStore = new HitFreqStore();
	veracHitStore.store([0], 1 - (procChance + (normalChance * acc)));

	for (let dmg = 0; dmg <= max; dmg++) {
		veracHitStore.store([dmg], normalChance * acc / (max + 1));
		veracHitStore.store([dmg + 1], procChance / (max + 1));
	}

	dps.rawAcc = acc;
	dps.accuracy = procChance + (1 - procChance) * dps.accuracy;
	dps.specAcc = dps.accuracy;
	dps.hitStore = veracHitStore;

	return dps;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Melee") {
		return false;
	}

	const equipment = player.extractEquipmentNames(true, "head", "body", "legs", "weapon");
	return (equipment.every(i => i.startsWith("Verac's")));
}
