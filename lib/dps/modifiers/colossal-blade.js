import { HitTracker } from "../HitTracker.js";

export function applyModifier (dps, player, monster) {
	const acc = dps.accuracy;
	const monsterSizeBonus = 2 * Math.min(monster.size, 5);
	const newMaxHit = dps.maxHit + monsterSizeBonus;

	const hitStore = new HitTracker();
	hitStore.store([0], 1 - acc);

	for (let hit = 0; hit <= newMaxHit; hit++) {
		hitStore.store([hit], acc / (newMaxHit + 1));
	}

	dps.hitStore = hitStore;
	dps.maxHit = newMaxHit;
	dps.maxList = [newMaxHit];

	return dps;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Melee") {
		return false;
	}

	return (player.equipment.weapon.name === "Colossal blade");
}
