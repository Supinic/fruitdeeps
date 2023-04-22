import { applyGenericBolt } from "./generic.js";

const baseSpecChance = 0.10;
const regularRangedBoost = 0.05;
const fieryRangedBoost = (1 / 15);

export function applyModifier (dps, player, monster) {
	const boost = (monster.attributes.includes("fiery"))
		? fieryRangedBoost
		: regularRangedBoost;

	return applyGenericBolt(dps, player, boost, baseSpecChance);
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Pearl bolts (e)" || ammo === "Pearl dragon bolts (e)");
}
