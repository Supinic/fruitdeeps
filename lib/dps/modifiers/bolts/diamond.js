/**
 * Sources from @JagexAsh:
 * https://twitter.com/JagexAsh/status/1240368367309139969
 * https://twitter.com/JagexAsh/status/715204639432556544
 * https://twitter.com/JagexAsh/status/890142540560818176
 * https://twitter.com/JagexAsh/status/591194407912669184
 */

import { HitFreqStore } from "../../HitFreqStore.js";
import { determineSpecChance } from "./generic.js";

const baseSpecChance = 0.10;

export function applyModifier (dps, player) {
	const specChance = determineSpecChance(baseSpecChance, player);
	const normalChance = (1 - specChance);

	const acc = dps.accuracy;
	const diamondHitStore = new HitFreqStore();
	diamondHitStore.store([0], normalChance * (1 - acc));

	for (let dmg = 0; dmg <= dps.maxHit; dmg++) {
		diamondHitStore.store([dmg], acc * normalChance / (dps.maxHit + 1));
	}

	const boostedMaxHit = Math.floor(dps.maxHit * 1.15);
	for (let dmg = 0; dmg <= boostedMaxHit; dmg++) {
		diamondHitStore.store([dmg], specChance / (boostedMaxHit + 1));
	}

	dps.specChance = specChance;
	dps.hitStore = diamondHitStore;
	dps.rawAcc = dps.accuracy;
	dps.accuracy = specChance + (1 - specChance) * dps.accuracy;
	dps.specAcc = dps.accuracy;
	dps.maxHitSpec = boostedMaxHit;

	return dps;
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Diamond bolts (e)" || ammo === "Diamond dragon bolts (e)");
}
