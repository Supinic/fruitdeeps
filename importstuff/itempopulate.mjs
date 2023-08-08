import fs from "fs/promises";

const categoryTable = {
	chinchompas: "Chinchompas",
	slash_sword: "Slash Sword",
	stab_sword: "Stab Sword",
	thrown: "Thrown",
	crossbow: "Crossbow",
	staff: "Staff",
	pickaxe: "Pickaxe",
	blunt: "Blunt",
	axe: "Axe",
	spiked: "Spiked",
	unarmed: "Unarmed",
	banner: "Banner",
	whip: "Whip",
	spear: "Spear",
	claw: "Claws",
	polestaff: "Polestaff",
	bladed_staff: "Bladed Staff",
	powered_staff: "Powered Staff",
	"2h_sword": "2h Sword",
	scythe: "Scythe",
	bow: "Bow",
	bulwark: "Bulwark",
	gun: "Gun",
	polearm: "Polearm",
	salamander: "Salamander",
	partisan: "Partisan"
};

const bonusTable = {
	attack_stab: "stabAttack",
	attack_slash: "slashAttack",
	attack_crush: "crushAttack",
	attack_magic: "magicAttack",
	attack_ranged: "rangedAttack",
	defence_stab: "stabDefence",
	defence_slash: "slashDefence",
	defence_crush: "crushDefence",
	defence_magic: "magicDefence",
	defence_ranged: "rangedDefence",
	melee_strength: "strength",
	ranged_strength: "rangedStrength",
	magic_damage: "magicStrength",
	prayer: "prayer"
};

const boxBonusList = [
	"attack_stab",
	"attack_slash",
	"attack_crush",
	"attack_magic",
	"attack_ranged",
	"defence_stab",
	"defence_slash",
	"defence_crush",
	"defence_magic",
	"defence_ranged",
	"melee_strength",
	"ranged_strength",
	"magic_damage",
	"prayer"
];

const itemSlots = [
	"cape",
	"head",
	"neck",
	"ammo",
	"weapon",
	"shield",
	"body",
	"legs",
	"hands",
	"feet",
	"ring",
	"2h"
];

const itemList = [
	{ name: "Toxic blowpipe (Bronze)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 21, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Iron)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 22, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Steel)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 23, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Black)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 26, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Mithril)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 29, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Adamant)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 37, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Rune)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 46, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Amethyst)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 48, 0, 0], id: 12926, category: "Thrown", speed: 3 },
	{ name: "Toxic blowpipe (Dragon)", slot: "2h", bonuses: [0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 55, 0, 0], id: 12926, category: "Thrown", speed: 3 }

];

const itemNames = itemList.map((item) => item.name);

const fetchSlotItems = async (slot) => {
	console.log(`Fetching items for slot: ${slot}`);

	const slotFetch = await fetch(`https://osrsbox.ivr.ovh/items-json-slot/items-${slot}.json`);
	const slotData = await slotFetch.json();

	for (const [itemID, itemMeta] of Object.entries(slotData)) {
		const item = {
			name: itemMeta.wiki_name,
			slot,
			bonuses: boxBonusList.map((bonus) => itemMeta.equipment[bonus]),
			id: itemMeta.id
		};

		if (slot === "2h" || slot === "weapon") {
			item.category = categoryTable[itemMeta.weapon.weapon_type];
			item.speed = itemMeta.weapon.attack_speed;
		}

		if (!itemNames.includes(item.name)) {
			itemList.push(item);
			itemNames.push(item.name);

			const itemImageBuffer = Buffer.from(itemMeta.icon, "base64");
			const itemImagePath = `./public/assets/item_images/${itemMeta.id}.png`;

			await fs.writeFile(itemImagePath, itemImageBuffer);
		}
	}
};

const fetchAllSlots = async () => {
	for (const slot of itemSlots) {
		await fetchSlotItems(slot);
	}
	await fs.writeFile("./public/assets/items.json", JSON.stringify(itemList));
};

await fetchAllSlots();
