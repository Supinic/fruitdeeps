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

	if (equivalentPickaxeLevel === 0) {
		const hitStore = new HitFreqStore();

		dps.maxHit = 0;
		for (let i = 0; i < dps.maxList.length; i++) {
			dps.maxList[i] = 0;
		}

		hitStore.storeSingle(0, 1);
		dps.hitStore = hitStore;

		return dps;
	}

	const multiplier = (50 + equivalentPickaxeLevel + player.stats.mining) / 150;
	const guardiansHitStore = HitFreqStore.multiplySingle(dps.hitStore, multiplier);

	dps.maxHit = guardiansHitStore.maxHit;
	dps.maxList = guardiansHitStore.maxList;
	dps.hitStore = guardiansHitStore;

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
