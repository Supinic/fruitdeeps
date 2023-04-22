import { HitFreqStore } from "../HitFreqStore.js";
import { isApplied as isCorpApplied } from "./corporeal-beast.js";
import { isApplied as isToaApplied } from "./tombs-of-amascut.js";

const clamp = (n) => Math.max(0, Math.min(1, n));

const accuracyFormula = (atk, def) => {
	if (atk > def) {
		return clamp(1 - (def + 2) * (2 * def + 3) / (atk + 1) / (atk + 1) / 6);
	}
	else {
		return clamp(atk * (4 * atk + 5) / 6 / (atk + 1) / (def + 1));
	}
};

export function applyModifier (dps, player, monster) {
	const oldMax = dps.maxHit;
	const min = Math.trunc(oldMax * 0.15);
	const newMax = oldMax - min;

	let acc;
	if (isToaApplied(dps, player, monster)) {
		acc = dps.accuracy + (1 - dps.accuracy) * dps.accuracy;
	}
	else {
		acc = accuracyFormula(dps.playerRoll, dps.npcRoll);
	}

	const hitStore = new HitFreqStore();
	hitStore.store([0], 1 - acc);

	for (let h1 = min; h1 <= newMax; h1 += 1) {
		hitStore.store([h1], acc / (newMax - min + 1));
	}

	// *Only* apply the Fang's max hit damage reduction if the special attack has not been selected.
	if (!this.calcs.specName) {
		dps.maxHitSpec = newMax;
	}

	if (isCorpApplied(dps, player, monster)) {
		dps.maxHitSpec = Math.trunc(newMax / 2);
	}

	dps.hitStore = hitStore;
	dps.specAcc = acc;
	return dps;
}

export function isApplied (dps, player) {
	// Includes ornament version `(or)`
	return (player.equipment.weapon.name.startsWith("Osmumten's fang"));
}
