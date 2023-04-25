import { applyGenericBolt } from "./generic.js";

const baseSpecChance = 0.06;
const rangedBoost = 0;

export function apply (dps, player) {
	return applyGenericBolt(dps, player, rangedBoost, baseSpecChance);
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Jade bolts (e)" || ammo === "Jade dragon bolts (e)");
}
