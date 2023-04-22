const attributes = {
	demonic: ["Arclight"],
	leafy: ["Leaf-bladed battleaxe"], // Leaf-bladed spear and sword do *NOT* get a bonus, and hence don't get a flag
	dragon: ["Dragon hunter crossbow", "Dragon hunter lance"],
	vampyre: ["Blisterwood flail", "Blisterwood sickle", "Ivandis flail"],
	xerician: ["Twisted bow"]
};

const specialAttributeFlags = {
	"Twisted bow": "Twisted bow - Chambers"
};

const meleeWildernessWeapons = ["Viggora's chainmace", "Ursine chainmace"];

export function getFlags (dps, player, monster) {
	if (dps.vertex !== "Melee") {
		return [];
	}

	const { weapon } = player.extractEquipmentNames(false, "weapon");
	for (const [attribute, weaponList] of Object.entries(attributes)) {
		if (!monster.attributes.includes(attribute)) {
			continue;
		}

		if (weaponList.includes(weapon)) {
			return specialAttributeFlags[weapon] ? [specialAttributeFlags[weapon]] : [weapon];
		}
	}

	if (player.misc.wilderness && meleeWildernessWeapons.includes(weapon)) {
		return ["Viggora's chainmace"];
	}
	else if (weapon.includes("Osmumten's fang")) {
		// Includes ornament kit, "(or)"
		return ["Osmumten's fang"];
	}
	else if (weapon.toLowerCase().includes("scythe of vitur")) {
		// Includes cosmetic upgrades, "Sanguine" and "Holy"
		return ["Scythe of vitur"];
	}
	else if (weapon.includes("Twisted bow")) {
		return ["Twisted bow"];
	}

	return [];
}
