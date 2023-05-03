import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps, player) {
	const rank = player.misc.baRank;
	const hitList = dps.hitStore.getFreqs();
	const newHitStore = new HitFreqStore();

	for (let i = 0; i < hitList.length; i++) {
		const hit = { dmg: [], p: hitList[i].p };
		for (let j = 0; j < hitList[i].dmg.length; j++) {
			hit.dmg[j] = hitList[i].dmg[j] + rank;
		}

		newHitStore.store(hit.dmg, hit.p);
	}

	for (let hitNum = 0; hitNum < dps.maxList.length; hitNum++) {
		dps.maxList[hitNum] += player.misc.baRank;
	}

	if (typeof dps.maxHitSpec === "number") {
		dps.maxHitSpec += player.misc.baRank;
	}

	dps.hitStore = newHitStore;

	return dps;
}

export function isApplied (dps, player, monster) {
	return (monster.attributes.includes("penance"));
}
