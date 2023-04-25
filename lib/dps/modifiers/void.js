const helmTypes = {
	"Void ranger helm": "Ranged",
	"Void ranger helm (or)": "Ranged",
	"Void mage helm": "Magic",
	"Void mage helm (or)": "Magic",
	"Void melee helm": "Melee",
	"Void melee helm (or)": "Melee"
};

const getVoidType = (player) => {
	const { head } = player.extractEquipmentNames(false, "head");
	return helmTypes[head];
};

const isElite = (player) => {
	const armour = player.extractEquipmentNames(true, "body", "legs");
	return (armour.every(i => i.startsWith("Elite")));
};

export function modifyEffectiveStrengthLevel (bonus, dps, player) {
	const hasEliteVoid = isElite(player);
	const voidType = getVoidType(player);
	if (dps.vertex !== voidType) {
		throw new Error(`Void vertex mismatch ${voidType} ≠ ${dps.vertex}`);
	}

	let multiplier = 1;
	if (voidType === "Ranged") {
		multiplier = (hasEliteVoid) ? 1.125 : 1.10;
	}
	else if (voidType === "Melee") {
		multiplier = 1.10;
	}
	else if (voidType === "Magic" && hasEliteVoid) {
		multiplier = 1.025;
	}

	return Math.floor(bonus * multiplier);
}

export function modifyEffectiveAttackLevel (attackLevel, dps, player) {
	const voidType = getVoidType(player);
	if (dps.vertex !== voidType) {
		throw new Error(`Sanity check: Void vertex mismatch ${voidType} ≠ ${dps.vertex}`);
	}

	if (voidType === "Ranged" || voidType === "Melee") {
		return Math.floor(attackLevel * 1.10);
	}
	else if (voidType === "Magic") {
		return Math.floor(attackLevel * 1.45);
	}

	return attackLevel;
}

export function isApplied (dps, player) {
	const equipmentNames = player.extractEquipmentNames(true, "head", "hands", "body", "legs");
	if (equipmentNames.some(i => !i.toLowerCase().includes("void"))) {
		return false;
	}

	// Make sure the selected attack vertex matches the Void helm type
	// This is to prevent the bonus from applying if the incorrect weapon vertex (or a spell for non-magic void) is used
	const head = equipmentNames[0];
	const applicableVertex = helmTypes[head];
	return (dps.vertex === applicableVertex);
}
