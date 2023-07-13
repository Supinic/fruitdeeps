export function applyModifier (dps, player) {
	const rank = player.misc.baRank;

	dps.hitStore.applyFlatBonus(rank);
	dps.maxList = dps.hitStore.maxList;
	dps.maxHit = dps.hitStore.maxHit;

	return dps;
}

export function isApplied (dps, player, monster) {
	return (monster.attributes.includes("penance"));
}
