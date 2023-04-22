import { applyGenericBolt } from "./generic";

const baseSpecChance = 0.05;
const rangedBoost = 0.10;

export function applyModifier (dps, player) {
	return applyGenericBolt(dps, player, rangedBoost, baseSpecChance);
}

export function isApplied (dps, player) {
	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Opal bolts (e)" || ammo === "Opal dragon bolts (e)");
}
