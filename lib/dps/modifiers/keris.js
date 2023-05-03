/*
 * Keris and Keris partisan have a 33% damage bonus against kalphites and scabarites.
 * Additionally, there is a (1/51) chance of dealing 3x the damage, added after the previous boost has been applied.
 * Articles:
 * - https://oldschool.runescape.wiki/w/Keris
 * - https://oldschool.runescape.wiki/w/Keris_partisan
 * Source: https://twitter.com/JagexAsh/status/1632716109722923008
 */
import { HitFreqStore } from "../HitFreqStore.js";

const scabarites = [
	"Scarabs",
	"Scarab swarm",
	"Locust rider",
	"Scarab mage",
	"Giant scarab"
];

/**
 * Ideally, this method would be refactored as a "scabarite" attribute of the NPC, similar to kalphites.
 */
export function isScabarite (monsterName) {
	return scabarites.includes(monsterName);
}

const multiplier = 1.33;
export function applyModifier (dps) {
	const newMax = Math.floor(dps.maxHit * multiplier);
	const specMax = newMax * 3;

	const acc = dps.accuracy;
	const kerisHitStore = new HitFreqStore();
	kerisHitStore.store([0], 1 - acc);

	// (50/51) chance to land a normal attack
	for (let dmg = 0; dmg <= newMax; dmg++) {
		kerisHitStore.store([dmg], acc * 50 / 51 / (newMax + 1));
	}

	// (1/51) chance to land a special proc, dealing 300% of the regular damage roll
	for (let dmg = 0; dmg <= newMax; dmg++) {
		kerisHitStore.store([dmg * 3], acc / 51 / (dps.maxHit + 1));
	}

	dps.maxList = [newMax];
	dps.maxHit = newMax;
	dps.maxHitSpec = specMax;
	dps.hitStore = kerisHitStore;

	return dps;
}

export function isApplied (dps, player, monster) {
	return (monster.attributes.includes("kalphite") || isScabarite(monster.name));
}
