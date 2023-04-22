import { HitFreqStore } from "../HitFreqStore.js";

function pickaxeToLevel (pickName) {
	switch (pickName) {
		case "3rd age pickaxe":
		case "Crystal pickaxe (Active)":
		case "Crystal pickaxe (Inactive)":
		case "Crystal pickaxe (The Gauntlet)":
		case "Corrupted pickaxe":
		case "Infernal pickaxe (Charged)":
		case "Infernal pickaxe (Uncharged)":
		case "Dragon pickaxe":
		case "Dragon pickaxe (upgraded)":
		case "Dragon pickaxe(or)":
			return 61;

		case "Rune pickaxe":
		case "Gilded pickaxe":
			return 41;

		case "Adamant pickaxe":
			return 31;

		case "Mithril pickaxe":
			return 21;

		case "Black pickaxe":
			return 11;

		case "Steel pickaxe":
			return 6;

		case "Iron pickaxe":
		case "Bronze pickaxe":
			return 1;
	}

	return 0;
}

export function applyModifier (dps, player) {
	const pick = pickaxeToLevel(player.equipment.weapon.name);
	const guardiansHitStore = new HitFreqStore();

	if (pick === 0) {
		dps.maxHit = 0;
		for (let i = 0; i < dps.maxList.length; i++) {
			dps.maxList[i] = 0;
		}

		guardiansHitStore.store([0], 1);
		dps.hitStore = guardiansHitStore;

		return dps;
	}

	const boost = (50 + pick + this.state.player.misc.mining) / 150;
	const hitDist = dps.hitStore.getFreqs();

	for (let i = 0; i < hitDist.length; i++) {
		for (let dmg = 0; dmg < hitDist[i].dmg.length; dmg++) {
			hitDist[i].dmg[dmg] = Math.trunc(hitDist[i].dmg[dmg] * boost);
		}

		guardiansHitStore.store(hitDist[i].dmg, hitDist[i].p);
	}

	dps.hitStore = guardiansHitStore;

	for (let i = 0; i < dps.maxList.length; i++) {
		dps.maxList[i] = Math.trunc(dps.maxList[i] * boost);
	}

	return dps;
}

export function modifyMaxHit (maxHit, dps) {
	if (dps.vertex !== "Melee") {
		return 0;
	}

	return maxHit;
}

export function isApplied (dps, player, monster) {
	return (monster.name === "Guardian");
}
