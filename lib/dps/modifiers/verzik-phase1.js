import { generalFormula } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

/**
 * Comment by @qhps:
 * IIRC: at p1 verzik you roll your normal damage number and additionally roll a 0-10,
 * and the game then takes the lower of those two rolls.
 */

export function applyModifier (dps) {
	let capMax = 10;
	if (dps.vertex === "Ranged" || dps.vertex === "Magic") {
		capMax = 3;
	}

	const hitStore = dps.hitStore;
	const capHitStore = new HitFreqStore();

	let hitList = hitStore.getFreqs();
	for (let i = 0; i < hitList.length; i++) {
		const dmg = hitList[i].dmg;
		const cappedDmg = [];

		for (let j = 0; j < dmg.length; j++) {
			cappedDmg.push(Math.min(dmg[j], capMax));
		}

		capHitStore.store(cappedDmg, hitList[i].p);
	}

	hitList = capHitStore.getFreqs();
	const verzikHitStore = new HitFreqStore();

	// @todo what in the world is this mess? please refactor ASAP
	for (let hitListIndex = 0; hitListIndex < hitList.length; hitListIndex++) {
		let toAppend = [hitList[hitListIndex]];
		for (let hitNum = 0; hitNum < hitList[hitListIndex].dmg.length; hitNum++) {
			const newAppend = [];
			for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
				const dmg = toAppend[appendIndex].dmg[hitNum];
				for (let verzikRoll = 0; verzikRoll <= Math.min(capMax, dmg); verzikRoll++) {
					const hitObj = { dmg: [...toAppend[appendIndex].dmg], p: toAppend[appendIndex].p };
					hitObj.dmg[hitNum] = verzikRoll;
					if (verzikRoll === dmg) {
						hitObj.p = hitObj.p / (capMax + 1) * (capMax - dmg + 1);
					}
					else {
						hitObj.p = hitObj.p / (capMax + 1);
					}
					newAppend.push(hitObj);
				}
			}
			toAppend = newAppend;
		}

		for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
			verzikHitStore.store(toAppend[appendIndex].dmg, toAppend[appendIndex].p);
		}
	}

	dps.maxList = dps.maxList.map(i => (i > capMax) ? capMax : i);
	dps.hitStore = verzikHitStore;

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

	return (monster.name === "Verzik Vitur" && monster.combat === 1040);
}
