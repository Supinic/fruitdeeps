// Source for the damage calculation: https://twitter.com/JagexAsh/status/1007600220358742021
// Archive of above tweet: https://web.archive.org/web/20200430121332/https://twitter.com/JagexAsh/status/1007600220358742021
import { HitFreqStore } from "../HitFreqStore.js";

const pickaxeTiers = [
	{
		level: 61,
		tiers: ["3rd age", "crystal", "infernal", "dragon"]
	},
	{
		level: 41,
		tiers: ["rune", "gilded"]
	},
	{
		level: 31,
		tiers: ["adamant"]
	},
	{
		level: 21,
		tiers: ["mithril"]
	},
	{
		level: 11,
		tiers: ["black"]
	},
	{
		level: 6,
		tiers: ["steel"]
	},
	{
		level: 1,
		tiers: ["iron", "bronze"]
	}
];

export function applyModifier (dps, player) {
	const { weapon } = player.equipment;

	let equivalentPickaxeLevel = 0;
	if (weapon.category === "Pickaxe") {
		for (const { level, tiers } of pickaxeTiers) {
			if (tiers.some(tier => weapon.name.toLowerCase().includes(tier))) {
				equivalentPickaxeLevel = level;
				break;
			}
		}
	}

	const guardiansHitStore = new HitFreqStore();
	if (equivalentPickaxeLevel === 0) {
		dps.maxHit = 0;
		for (let i = 0; i < dps.maxList.length; i++) {
			dps.maxList[i] = 0;
		}

		guardiansHitStore.store([0], 1);
		dps.hitStore = guardiansHitStore;

		return dps;
	}

	const multiplier = (50 + equivalentPickaxeLevel + player.misc.mining) / 150;
	const hitDist = dps.hitStore.getFreqs();

	for (let i = 0; i < hitDist.length; i++) {
		for (let dmg = 0; dmg < hitDist[i].dmg.length; dmg++) {
			hitDist[i].dmg[dmg] = Math.trunc(hitDist[i].dmg[dmg] * multiplier);
		}

		guardiansHitStore.store(hitDist[i].dmg, hitDist[i].p);
	}

	dps.hitStore = guardiansHitStore;

	for (let i = 0; i < dps.maxList.length; i++) {
		dps.maxList[i] = Math.trunc(dps.maxList[i] * multiplier);
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
