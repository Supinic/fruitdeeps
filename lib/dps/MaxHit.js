import { PrayerBook } from "../PrayerBook.js";
import { SpellBook } from "../SpellBook.js";

// MaxHit calculates a player's max hit from player and monster state
// Notes:
//  Melee and ranged max hit codes are very redundant
//  Can definitely generalize them a lot. Not sure if that will improve or diminish readability, however
//  I think that this should be done, eventually.

const weaponMultiplier = {
	Arclight: 1.7,
	"Dragon hunter lance": 1.2,
	"Viggora's chainmace": 1.5,
	"Dragon hunter crossbow": 1.3,
	"Craw's bow": 1.5,
	"Obsidian armor": 1.1,
	"Obsidian armour": 1.1,
	"Berserker necklace": 1.2
};

const weaponMultAfterInq = {
	"Leaf-bladed battleaxe": 1.175,
	"Ivandis flail": 1.2,
	"Blisterwood flail": 1.25,
	"Blisterwood sickle": 1.15
};

export class MaxHit {
	constructor (state, calcs) {
		this.state = state;
		this.flags = calcs.flags;
		this.vertex = calcs.vertex;
		const prayerBook = new PrayerBook();
		this.prayerModifiers = prayerBook.getModifiers(this.state.player.prayers);
	}

	generalFormula (a, b) {
		return Math.floor(0.5 + a * (b + 64) / 640);
	}

	// These methods are really long, but in general since it's really procedural it's readable
	melee () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;
		const strBonus = player.bonuses[10]; // str bonus

		// Start with visible stats
		let effectiveStr = player.boostedStats.strength;

		// apply prayer bonus
		effectiveStr = Math.floor(effectiveStr * this.prayerModifiers.strength);

		// add attack style bonus
		if (attackStyle === "Controlled") {
			effectiveStr += 1;
		}
		else if (attackStyle === "Aggressive") {
			effectiveStr += 3;
		}
		effectiveStr += 8;

		// @todo: modifyEffectiveStrength calls should be done here

		// apply void melee bonus
		if (this.flags.includes("Void melee")) {
			effectiveStr = Math.floor(effectiveStr * 11 / 10);
		}

		// Calc max hit
		let maxHit = this.generalFormula(effectiveStr, strBonus);

		// @todo: modifyMaxHit calls should be done here

		if (this.flags.includes("Tier 6")) {
			maxHit = Math.floor(maxHit * 11 / 10);
		}

		// apply black mask/salve bonus
		if (this.flags.includes("Salve amulet (e)") || this.flags.includes("Salve amulet(ei)")) {
			maxHit = Math.floor(maxHit * 6 / 5);
		}
		else if (this.flags.includes("Salve amulet") || this.flags.includes("Salve amulet(i)")) {
			maxHit = Math.floor(maxHit * 7 / 6);
		}
		// Redundant, but separate from salve amulet for readability. The minimizer fixes this in production
		else if (this.flags.includes("Black mask") || this.flags.includes("Black mask (i)")) {
			maxHit = Math.floor(maxHit * 7 / 6);
		}

		// apply weapon special effect bonuses
		for (const key of Object.keys(weaponMultiplier)) {
			if (this.flags.includes(key)) {
				maxHit = Math.floor(maxHit * weaponMultiplier[key]);
			}
		}

		// inq bonus
		const inqList = ["Inquisitor's hauberk", "Inquisitor's great helm", "Inquisitor's plateskirt"];
		let inqBonus = 1000;
		for (const flag of inqList) {
			if (this.flags.includes(flag)) {
				inqBonus += 5;
			}
		}
		if (this.flags.includes("Inquisitor's armour set")) {
			inqBonus = 1025;
		}
		maxHit = Math.floor(maxHit * inqBonus / 1000);

		for (const key of Object.keys(weaponMultAfterInq)) {
			if (this.flags.includes(key)) {
				maxHit = Math.floor(maxHit * weaponMultAfterInq[key]);
			}
		}

		return maxHit;
	}

	ranged () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;
		const strBonus = player.bonuses[11]; // ranged strength
		const monster = this.state.monster;

		// Start with visible stats
		let effectiveStr = player.boostedStats.ranged;

		// apply prayer bonus
		effectiveStr = Math.floor(effectiveStr * this.prayerModifiers.rangedStr);

		// add attack style bonus
		if (attackStyle === "Accurate") {
			effectiveStr += 3;
		}
		effectiveStr += 8;

		// @todo: modifyEffectiveStrength calls should be done here

		// apply void ranged bonus and void elite ranged bonus
		if (this.flags.includes("Elite void range")) {
			effectiveStr = Math.floor(effectiveStr * 9 / 8);
		}
		else if (this.flags.includes("Void range")) {
			effectiveStr = Math.floor(effectiveStr * 11 / 10);
		}

		// Calc max hit
		let maxHit = this.generalFormula(effectiveStr, strBonus);
		// @todo: modifyMaxHit calls should be done here

		if (this.flags.includes("Quick Shot") && this.flags.includes("Tier 6")) {
			maxHit = Math.floor(maxHit * 12 / 10);
		}
		else if (this.flags.includes("Quick Shot") || this.flags.includes("Tier 6")) {
			maxHit = Math.floor(maxHit * 11 / 10);
		}

		// apply black mask/salve bonus
		if (this.flags.includes("Salve amulet(ei)")) {
			maxHit = Math.floor(maxHit * 6 / 5);
		}
		else if (this.flags.includes("Salve amulet(i)")) {
			maxHit = Math.floor(maxHit * 23 / 20);
		}
		// Redundant, but separate from salve amulet for readability. The minimizer fixes this in production
		else if (this.flags.includes("Black mask (i)")) {
			maxHit = Math.floor(maxHit * 23 / 20);
		}

		// tbow
		if (this.flags.includes("Twisted bow") || this.flags.includes("Twisted bow - Chambers")) {
			let cap = 250;
			if (this.flags.includes("Twisted bow - Chambers")) {
				cap = 350;
			}
			const magic = Math.min(Math.max(monster.stats.mage, monster.stats.amagic), cap);
			const tbowMod = 250 + Math.floor((3 * magic - 14) / 100) - Math.floor((3 * magic / 10 - 140) ** 2 / 100);
			maxHit = Math.floor(maxHit * tbowMod / 100); // should be 350 for cox
		}

		// apply weapon special effect bonuses
		for (const key of Object.keys(weaponMultiplier)) {
			if (this.flags.includes(key)) {
				maxHit = Math.floor(maxHit * weaponMultiplier[key]);
			}
		}

		return maxHit;
	}

	magic () {
		const spellBook = new SpellBook();
		const spell = this.state.player.spell;
		const magic = this.state.player.boostedStats.magic;

		let dmgBonus = this.state.player.bonuses[12];
		if (this.flags.includes("Tumeken's shadow") && this.flags.includes("Tombs of Amascut")) {
			dmgBonus = Math.min(100, dmgBonus * 4);
		}
		else if (this.flags.includes("Tumeken's shadow")) {
			dmgBonus = Math.min(100, dmgBonus * 3);
		}

		const weapon = this.state.player.equipment.weapon.name;

		let maxHit = 0;

		// @todo: some kind of standardization for these max hit tables

		if (spell === "Magic Dart") {
			if (this.flags.includes("Slayer's staff (e)")) {
				maxHit = Math.floor(magic / 6) + 13;
			}
			else {
				maxHit = Math.floor(magic / 10) + 10;
			}
		}
		else if (spell) {
			maxHit = spellBook.maxLookup(spell);
		}
		else {
			switch (weapon) {
				case "Trident of the seas":
				case "Trident of the seas (e)":
					maxHit = Math.floor(magic / 3) - 5;
					break;
				case "Trident of the swamp":
				case "Trident of the swamp (e)":
					maxHit = Math.floor(magic / 3) - 2;
					break;
				case "Sanguinesti staff":
				case "Holy sanguinesti staff":
					maxHit = Math.floor(magic / 3) - 1;
					break;
				case "Tumeken's shadow":
					maxHit = Math.floor(magic / 3) + 1;
					break;
				case "Black salamander":
					maxHit = this.generalFormula(magic, 92);
					break;
				case "Red salamander":
					maxHit = this.generalFormula(magic, 77);
					break;
				case "Orange salamander":
					maxHit = this.generalFormula(magic, 59);
					break;
				case "Swamp lizard":
					maxHit = this.generalFormula(magic, 56);
					break;
				case "Starter staff":
					maxHit = spellBook.maxLookup("Fire Strike");
					break;
				case "Dawnbringer":
					maxHit = Math.floor(magic / 6) - 1;
					break;
				case "Corrupted staff (basic)":
				case "Crystal staff (basic)":
					maxHit = 23;
					break;
				case "Corrupted staff (attuned)":
				case "Crystal staff (attuned)":
					maxHit = 31;
					break;
				case "Corrupted staff (perfected)":
				case "Crystal staff (perfected)":
					maxHit = 39;
					break;
			}
		}

		// static max hit additives
		if (this.flags.includes("Charge")) {
			maxHit += 10;
		}
		else if (this.flags.includes("Chaos gauntlets")) {
			maxHit += 3;
		}

		// dmg bonus additives
		// @todo: some kind of damage bonus method?
		if (this.flags.includes("Smoke battlestaff")) {
			dmgBonus += 10;
		}
		if (this.flags.includes("Elite void magic")) {
			dmgBonus += 2.5;
		}
		if (this.flags.includes("Salve amulet(ei)")) {
			dmgBonus += 20;
		}
		else if (this.flags.includes("Salve amulet(i)")) {
			dmgBonus += 15;
		}

		if (this.flags.includes("Thammaron's sceptre")) {
			dmgBonus += 25;
		}

		maxHit = Math.floor(maxHit * (100 + dmgBonus) / 100);

		// @todo: modifyMaxHit calls should be done here

		if (this.flags.includes("Black mask (i)")) {
			maxHit = Math.floor(maxHit * 23 / 20);
		}

		if (this.flags.includes("Tome of fire")) {
			maxHit = Math.floor(maxHit * 3 / 2);
		}

		if (this.flags.includes("Tier 6")) {
			maxHit = Math.floor(maxHit * 11 / 10);
		}

		return maxHit;
	}

	output () {
		if (this.vertex === "Melee") {
			return this.melee();
		}
		else if (this.vertex === "Ranged") {
			return this.ranged();
		}
		else if (this.vertex === "Magic") {
			return this.magic();
		}
		else {
			return 0;
		}
	}
}
