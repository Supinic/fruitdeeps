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

	// 2024-01-17 change: Fang accuracy effects only apply to Stab styles, not Slash.
	// We've decided to solidify the Fang as a Stab weapon by removing its double Accuracy roll effect from the
	// Slash combat style. This means that you’ll only see the Fang’s benefits while using it to Stab.
	// https://secure.runescape.com/m=news/scythe--fang-updates?oldschool=1
	let hitAcc = dps.accuracy;
	if (player.attackStyle.type === "Stab") {
		let acc;
		if (isToaApplied(dps, player, monster)) {
			acc = dps.accuracy + (1 - dps.accuracy) * dps.accuracy;
		}
		else {
			acc = accuracyFormula(dps.playerRoll, dps.npcRoll);
		}

		hitAcc = acc;
		dps.specAcc = acc;
	}

	const hitStore = new HitFreqStore();
	hitStore.store([0], 1 - hitAcc);

	for (let h1 = min; h1 <= newMax; h1 += 1) {
		hitStore.store([h1], hitAcc / (newMax - min + 1));
	}

	// *Only* apply the Fang's max hit damage reduction if the special attack has not been selected.
	if (!dps.specName) {
		dps.maxHitSpec = newMax;
	}

	if (isCorpApplied(dps, player, monster)) {
		dps.maxHitSpec = Math.trunc(newMax / 2);
	}

	dps.hitStore = hitStore;
	return dps;
}

export function isApplied (dps, player) {
	// Includes ornament version `(or)`
	return (player.equipment.weapon.name.startsWith("Osmumten's fang"));
}
