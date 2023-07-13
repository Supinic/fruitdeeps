import { HitTracker } from "../HitTracker.js";

const damageCap = 50;

export function applyModifier (dps) {
	const oldDistList = dps.hitStore.getFreqs();
	const capHitStore = new HitTracker();

	for (let i = 0; i < oldDistList.length; i++) {
		const hitItem = oldDistList[i];
		for (let dmgIndex = 0; dmgIndex < hitItem.dmg.length; dmgIndex++) {
			hitItem.dmg[dmgIndex] = Math.min(damageCap + 1, hitItem.dmg[dmgIndex]);
		}
		capHitStore.store(hitItem.dmg, hitItem.p);
	}

	const hitList = capHitStore.getFreqs();
	const zulrahHitStore = new HitTracker();

	for (let i = 0; i < hitList.length; i++) {
		let toAppend = [hitList[i]];

		for (let dmgIndex = 0; dmgIndex < hitList[i].dmg.length; dmgIndex++) {
			const newAppend = [];
			for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
				if (toAppend[appendIndex].dmg[dmgIndex] > damageCap) {
					for (let dmg = 45; dmg <= 50; dmg++) {
						const hitObj = { dmg: [...toAppend[appendIndex].dmg], p: toAppend[appendIndex].p };
						hitObj.dmg[dmgIndex] = dmg;
						hitObj.p = hitObj.p / 6;
						newAppend.push(hitObj);
					}
				}
				else {
					newAppend.push(toAppend[appendIndex]);
				}
			}
			toAppend = newAppend;
		}

		for (let j = 0; j < toAppend.length; j++) {
			zulrahHitStore.store(toAppend[j].dmg, toAppend[j].p);
		}
	}

	dps.hitStore = zulrahHitStore;

	for (let i = 0; i < dps.maxList.length; i++) {
		dps.maxList[i] = Math.min(50, dps.maxList[i]);
	}

	if (typeof dps.maxHitSpec === "number" && dps.maxHitSpec > 50) {
		dps.maxHitSpec = 50;
	}

	return dps;
}

export function modifyMaxHit (maxHit, dps) {
	return (dps.vertex === "Melee") ? 0 : maxHit;
}

export function isApplied (dps, player, monster) {
	return (monster.name === "Zulrah");
}
