import { SpellBook } from "../../SpellBook.js";

const fireStrikeMaxHit = new SpellBook().maxLookup("Fire Strike");
const definitions = [
	{
		names: ["Thammaron's sceptre"],
		formula: (magic) => Math.floor(magic / 3) - 8
	},
	{
		names: ["Accursed sceptre"],
		formula: (magic) => Math.floor(magic / 3) - 6
	},
	{
		names: ["Trident of the seas", "Trident of the seas (e)"],
		formula: (magic) => Math.floor(magic / 3) - 5
	},
	{
		names: ["Trident of the swamp", "Trident of the swamp (e)"],
		formula: (magic) => Math.floor(magic / 3) - 2
	},
	{
		names: ["Sanguinesti staff", "Holy sanguinesti staff"],
		formula: (magic) => Math.floor(magic / 3) - 1
	},
	{
		names: ["Dawnbringer"],
		formula: (magic) => Math.floor(magic / 6) - 1
	},
	{
		names: ["Crystal staff (basic)", "Corrupted staff (basic)"],
		formula: () => 23
	},
	{
		names: ["Crystal staff (attuned)", "Corrupted staff (attuned)"],
		formula: () => 31
	},
	{
		names: ["Crystal staff (perfected)", "Corrupted staff (perfected)"],
		formula: () => 39
	},
	{
		names: ["Starter staff"],
		formula: () => fireStrikeMaxHit
	}
];

export function determineBaseMaxHit (dps, player) {
	const { magic } = player.boostedStats;
	const { weapon } = player.extractEquipmentNames(false, "weapon");

	const staffData = definitions.find(i => i.names.includes(weapon));
	return staffData.formula(magic);
}

const supportedWeapons = definitions.flatMap(i => i.names);
export function isApplied (dps, player) {
	const { weapon } = player.extractEquipmentNames(false, "weapon");
	return (supportedWeapons.includes(weapon));
}
