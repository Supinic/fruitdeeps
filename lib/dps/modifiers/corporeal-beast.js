import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps) {
	const hitList = dps.hitStore.getFreqs();
	const corpHitStore = new HitFreqStore();

	for (let i = 0; i < hitList.length; i++) {
		// @todo refactor this nested loop into a simple map() call
		const hit = {
			dmg: [],
			p: hitList[i].p
		};

		for (let j = 0; j < hitList[i].dmg.length; j++) {
			hit.dmg[j] = Math.floor(hitList[i].dmg[j] / 2);
		}

		corpHitStore.store(hit.dmg, hit.p);
	}

	dps.hitStore = corpHitStore;

	for (let i = 0; i < dps.maxList.length; i++) {
		dps.maxList[i] = Math.floor(dps.maxList[i] / 2);
	}

	dps.maxHit = Math.floor(dps.maxHit / 2);
	if (typeof dps.maxHitSpec === "number") {
		dps.maxHitSpec = Math.floor(dps.maxHitSpec / 2);
	}

	return dps;
}

/**
 * Corporeal Beast's 50% damage reduction applies to:
 * - all Ranged attacks
 * - all Melee attacks that are not using Stab attack style
 * - all Stab Melee attacks that aren't coming from a Spear/Halberd weapon, or the Osmumten's Fang.
 *
 * This function should therefore return `true` if the damage reduction applies.
 */
export function isApplied (dps, player, monster) {
	if (monster.name !== "Corporeal Beast") {
		return false;
	}

	if (dps.vertex === "Ranged") {
		return true;
	}
	else if (dps.vertex === "Magic") {
		return false;
	}

	const type = player.attackStyle.type;
	if (type !== "Stab") {
		return true;
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (!weapon.includes("spear") && !weapon.includes("halberd") && !weapon.includes("fang"));
}
