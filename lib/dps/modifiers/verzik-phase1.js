import { generalFormula } from "../Accuracy.js";
import { HitTracker, MultiHitTracker } from "../HitTracker.js";

const ENTRY_P1_LVL = 425;
const NORMAL_P1_LVL = 1040;

/**
 * Comment by @qhps:
 * IIRC: at p1 verzik you roll your normal damage number and additionally roll a 0-10,
 * and the game then takes the lower of those two rolls.
 */
const penalize = (cap, distribution) => {
	for (const dmg of distribution.keys()) {
		const p = distribution.get(dmg);
		for (let verzikRoll = 0; verzikRoll <= dmg; verzikRoll++) {
			if (verzikRoll === dmg) {
				const newP = p / (cap + 1) * (cap - dmg + 1);
				distribution.set(verzikRoll, newP);
			}
			else {
				const newP = p / (cap + 1);
				distribution.set(verzikRoll, distribution.get(verzikRoll) + newP);
			}
		}
	}
};

export function applyModifier (dps) {
	let capMax = 10;
	if (dps.vertex === "Ranged" || dps.vertex === "Magic") {
		capMax = 3;
	}

	const { hitStore } = dps;
	hitStore.clamp(capMax);

	if (hitStore instanceof HitTracker) {
		penalize(capMax, hitStore.distribution);
	}
	else if (hitStore instanceof MultiHitTracker) {
		for (const distribution of hitStore.distributions) {
			penalize(capMax, distribution);
		}
	}

	dps.maxHit = dps.hitStore.maxHit;
	dps.maxList = dps.hitStore.maxList;

	return dps;
}

export function modifyNpcDefenceRoll (roll, dps, player, monster) {
	if (dps.vertex !== "Magic") {
		return roll;
	}

	return generalFormula(monster.stats.def + 9, monster.stats.dmagic);
}

export function isApplied (dps, player, monster) {
	// Verzik (P1) damage cap does not apply at all to Dawnbringer
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (weapon === "Dawnbringer") {
		return false;
	}

	return (monster.name === "Verzik Vitur" && (monster.combat === NORMAL_P1_LVL || monster.combat === ENTRY_P1_LVL));
}
