// Dharok's set effect: Raises your damage according to your hp, after the damage roll

export function applyModifier (dps, player) {
	const currentHp = player.misc.currentHitpoints;
	const baseHp = player.stats.hitpoints;

	const multiplier = Math.max(1, 1 + (baseHp - currentHp) * baseHp / 10000);
	const hitTracker = dps.hitStore;

	hitTracker.applyMultiplier(multiplier);

	dps.maxHit = hitTracker.maxHit;
	dps.maxList = hitTracker.maxList;
	dps.hitStore = hitTracker;

	return dps;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Melee") {
		return false;
	}

	const equipment = player.extractEquipmentNames(true, "head", "body", "legs", "weapon");
	return (equipment.every(i => i.startsWith("Dharok's")));
}
