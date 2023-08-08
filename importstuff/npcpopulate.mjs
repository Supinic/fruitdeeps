import fs from "fs/promises";

console.log("Fetching OSRS Box data...");

const response = await fetch("https://osrsbox.ivr.ovh/monsters-complete.json");

/** @type {OsrsBoxMonsterData[]} */
const json = await response.json();
const npcList = Object.values(json).map(monster => ({
	name: monster.name,
	image: null, // TODO!
	version: monster.version,
	version_number: monster.version_number,
	combat: monster.combat_level ?? 0,
	size: monster.size ?? 1,
	attributes: monster.attributes ?? [],
	stats: {
		hitpoints: monster.hitpoints ?? 1,
		att: monster.attack_level,
		str: monster.strength_level,
		def: monster.defence_level,
		mage: monster.magic_level,
		range: monster.ranged_level,
		attbns: monster.attack_bonus,
		strbns: monster.strength_bonus,
		amagic: monster.attack_magic,
		mbns: monster.magic_bonus,
		arange: monster.attack_ranged,
		rngbns: monster.ranged_bonus,
		dstab: monster.defence_stab,
		dslash: monster.defence_slash,
		dcrush: monster.defence_crush,
		dmagic: monster.defence_magic,
		drange: monster.defence_slash
	}
}));

await fs.writeFile("./public/assets/npcs.json", JSON.stringify(npcList));

console.log("All NPCs parsed successfully");
process.exit();

/**
 * @typedef {Object} OsrsBoxMonsterData
 * @property {number} id
 * @property {string} name
 * @property {string} last_updated
 * @property {boolean} incomplete
 * @property {boolean} members
 * @property {string} release_date
 * @property {number} combat_level
 * @property {number} size
 * @property {number} hitpoints
 * @property {number} max_hit
 * @property {string[]} attack_type
 * @property {number} attack_speed
 * @property {boolean} aggressive
 * @property {boolean} poisonous
 * @property {boolean} venomous
 * @property {boolean} immune_poison
 * @property {boolean} immune_venom
 * @property {string[]} attributes
 * @property {string[]} category
 * @property {number} slayer_monster
 * @property {number} slayer_level
 * @property {number} slayer_xp
 * @property {string[]} slayer_masters
 * @property {boolean} duplicate
 * @property {string} examine
 * @property {string} wiki_name
 * @property {string|null} version
 * @property {number|null} version_number
 * @property {string} wiki_url
 * @property {number} attack_level
 * @property {number} strength_level
 * @property {number} defence_level
 * @property {number} ranged_level
 * @property {number} magic_level
 * @property {number} attack_bonus
 * @property {number} strength_bonus
 * @property {number} attack_magic
 * @property {number} magic_bonus
 * @property {number} attack_ranged
 * @property {number} ranged_bonus
 * @property {number} defence_stab
 * @property {number} defence_crush
 * @property {number} defence_slash
 * @property {number} defence_magic
 * @property {number} defence_ranged
 * @property {OsrsBoxDropItem[]} drops
 */

/**
 * @typedef {Object} OsrsBoxDropItem
 * @typedef {number} id
 * @typedef {string} name
 * @typedef {boolean} members
 * @typedef {string} quantity
 * @typedef {boolean} noted
 * @typedef {number} rarity
 * @typedef {number} rolls
 */
