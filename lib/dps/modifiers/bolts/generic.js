import { HitFreqStore } from "../../HitFreqStore.js";
import leaguesData from "../../../../game-data/leagues4.json";

export function determineSpecChance (baseSpecChance, player) {
	let specChance = baseSpecChance;
	if (player.misc.kandarinHard) {
		specChance *= 1.10;
	}
	if (player.misc[leaguesData.playerMiscProperty]) {
		specChance *= 2.00;
	}

	return specChance;
}

export function applyGenericBolt (dps, player, boostPercent, baseSpecChance) {
	const damageBoost = Math.floor(player.boostedStats.ranged * boostPercent);
	const acc = dps.accuracy;
	const m1 = dps.maxHit;
	const m2 = m1 + damageBoost;

	const specChance = determineSpecChance(baseSpecChance, player);

	const boltHitStore = new HitFreqStore();
	boltHitStore.store([0], (1 - specChance) * (1 - acc));

	for (let dmg = 0; dmg <= m1; dmg++) {
		boltHitStore.store([dmg], (1 - specChance) * acc / (m1 + 1));
		boltHitStore.store([dmg + damageBoost], specChance / (m1 + 1));
	}

	dps.hitStore = boltHitStore;
	dps.maxHitSpec = m2;
	dps.rawAcc = acc;
	dps.accuracy = specChance + (1 - specChance) * dps.accuracy;
	dps.specAcc = dps.accuracy;
	dps.specChance = specChance;

	return dps;
}
