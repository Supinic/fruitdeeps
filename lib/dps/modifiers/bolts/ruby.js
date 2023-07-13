import { HitTracker } from "../../HitTracker.js";
import { isApplied as isCorpApplied } from "../corporeal-beast.js";

const baseSpecChance = 0.06;

export function applyModifier (dps, player, monster) {
	const acc = dps.accuracy;
	const hp = monster.stats.hitpoints;

	let specDmg = Math.trunc(hp / 5);
	if (isCorpApplied(dps, player, monster)) {
		specDmg = Math.trunc(specDmg / 2);
	}

	specDmg = Math.min(100, specDmg);

	const max = dps.maxHit;
	const specChance = (player.misc.kandarinHard) ? (baseSpecChance * 1.10) : baseSpecChance;
	const normalChance = (1 - specChance);

	const rubiesHitStore = new HitTracker();
	rubiesHitStore.store([0], normalChance * (1 - acc));

	for (let dmg = 0; dmg <= max; dmg++) {
		rubiesHitStore.store([dmg], normalChance * acc / (max + 1));
	}

	rubiesHitStore.store([specDmg], specChance);

	dps.specChance = specChance;
	dps.hitStore = rubiesHitStore;
	dps.maxHitSpec = specDmg;
	dps.specAcc = specChance + (1 - specChance) * dps.accuracy;
	dps.specChance = specChance;

	return dps;
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Ruby bolts (e)" || ammo === "Ruby dragon bolts (e)");
}
