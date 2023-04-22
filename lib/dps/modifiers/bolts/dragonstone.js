import { applyGenericBolt } from "./generic";

const baseSpecChance = 0.06;
const rangedBoost = 0.20;

export function applyModifier (dps, player) {
	return applyGenericBolt(dps, player, rangedBoost, baseSpecChance);
}

export function isApplied (dps, player, monster) {
	if (monster.attributes.includes("dragon")) {
		return false;
	}

	const { ammo } = player.extractEquipmentNames(false, "ammo");
	return (ammo === "Dragonstone bolts (e)" || ammo === "Dragonstone dragon bolts (e)");
}
