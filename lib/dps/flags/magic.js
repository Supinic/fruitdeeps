import { SpellBook } from "../../SpellBook.js";

const godSpells = ["Saradomin Strike", "Flames of Zamorak", "Claws of Guthix"];
export function getFlags (dps, player) {
	const spell = player.spell;
	const stdSpells = new SpellBook().getSpellList().standard;
	const { hands, shield, ring, weapon } = player.extractEquipmentNames(false, "hands", "shield", "ring", "weapon");

	const flags = [];
	if (weapon === "Thammaron's sceptre" && spell && player.misc.wilderness) {
		flags.push("Thammaron's sceptre");
	}
	if (weapon === "Harmonised nightmare staff" && stdSpells.includes(spell)) {
		flags.push("Harmonised nightmare staff");
	}
	if (player.misc.charge && godSpells.includes(spell)) {
		flags.push("Charge");
	}
	if (hands === "Chaos gauntlets" && spell.includes("Bolt")) {
		flags.push("Chaos gauntlets");
	}
	if (shield === "Tome of fire" && spell && spell.includes("Fire")) {
		flags.push("Tome of fire");
	}
	if (weapon === "Smoke battlestaff" && stdSpells.includes(spell)) {
		flags.push("Smoke battlestaff");
	}
	if (ring === "Brimstone ring" && dps.vertex === "Magic") {
		flags.push("Brimstone ring");
	}
	if (weapon === "Tumeken's shadow" && !spell) {
		flags.push("Tumeken's shadow");
	}
	if (weapon === "Slayer's staff (e)" && spell === "Magic Dart" && player.misc.wilderness) {
		flags.push("Slayer's staff (e)");
	}

	return flags;
}
