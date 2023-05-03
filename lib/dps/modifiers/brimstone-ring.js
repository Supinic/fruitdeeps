import { compareRolls } from "../Accuracy.js";

const procChance = 0.25;
const normChance = (1 - procChance);

export function changeAttackRoll (acc, dps) {
	const normalAccuracy = dps.accuracy * normChance;
	const procAccuracy = procChance * compareRolls(dps.playerRoll, Math.ceil(dps.npcRoll * 0.90));

	return normalAccuracy + procAccuracy;
}

export function isApplied (dps, player) {
	if (dps.vertex !== "Magic") {
		return false;
	}

	const { ring } = player.extractEquipmentNames(false, "ring");
	return (ring === "Brimstone ring");
}
