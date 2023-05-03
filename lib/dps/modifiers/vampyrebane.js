const allowedWeapons = [
	{
		name: "Ivandis flail",
		accuracy: 1,
		damage: 1.20
	},
	{
		name: "Blisterwood sickle",
		accuracy: 1.05,
		damage: 1.15
	},
	{
		name: "Blisterwood flail",
		accuracy: 1.05,
		damage: 1.25
	}
];
const weaponList = allowedWeapons.map(i => i.name);

export function modifyMaxHit (maxHit, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	const { damage } = allowedWeapons.find(i => i.name === weapon);

	return Math.floor(maxHit * damage);
}

export function modifyAccuracy (roll, dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	const { accuracy } = allowedWeapons.find(i => i.name === weapon);

	return Math.floor(roll * accuracy);
}

export function isApplied (dps, player, monster) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	if (!weaponList.includes(weapon)) {
		return false;
	}

	return monster.attributes.includes("vampyre");
}
