/*
 * Keris partisan of breaching has a 33% accuracy bonus against kalphites and scabarites, on top of
 * regular Keris bonuses.
 * Article: https://oldschool.runescape.wiki/w/Keris_partisan_of_breaching
 */
import { isScabarite } from "./keris.js";

const multiplier = 1.33;
export function modifyAccuracy (roll) {
	return Math.floor(roll * multiplier);
}

export function isApplied (dps, player, monster) {
	if (player.equipment.weapon.name !== "Keris partisan of breaching") {
		return false;
	}

	return (monster.attributes.includes("kalphite") || isScabarite(monster.name));
}
