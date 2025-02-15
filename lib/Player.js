// Player.js defines the player model that is used for all calculations
// The Player constructor accepts a serialized version of the Player object
// Player.serialize() exports a serialized version of the object
// Notes:
//  Player.bonuses and Player.boostedStats may both be getters.
//  I think that boostedStats should be a getter and bonuses should not be, to allow bonuses to be custom defined

import { apply as applyBoosts, determineBoostStats, list as boostNameList } from "./Boosts.js";
import { PrayerBook } from "./PrayerBook.js";
import { AttackStyles } from "./AttackStyles.js";

import equipmentExceptions from "./equipment-exceptions.json" assert { type: "json" };
import leaguesData from "../game-data/leagues4.json" assert { type: "json" };

const slots = [
	"cape", "head", "neck", "ammo", "weapon", "shield", "body", "legs", "hands", "feet", "ring", "2h"
];

const bonusList = [
	"stabAttack",
	"slashAttack",
	"crushAttack",
	"magicAttack",
	"rangedAttack",
	"stabDefence",
	"slashDefence",
	"crushDefence",
	"magicDefence",
	"rangedDefence",
	"strength",
	"rangedStrength",
	"magicStrength",
	"prayer"
];

const stats = [
	"attack",
	"strength",
	"ranged",
	"magic",
	"hitpoints",
	"prayer",
	"defence",
	"mining"
];

const nullItem = {
	name: "",
	slot: null,
	bonuses: new Array(14).fill(0)
};

const unarmed = {
	name: "",
	slot: "weapon",
	bonuses: new Array(14).fill(0),
	category: "Unarmed",
	speed: 4
};

const defaultPlayer = Object.freeze({
	stats: Object.freeze({
		attack: 99,
		strength: 99,
		ranged: 99,
		magic: 99,
		hitpoints: 99,
		prayer: 99,
		defence: 99,
		mining: 99
	}),
	misc: Object.freeze({
		onTask: true,
		wilderness: true,
		currentHitpoints: 99,
		charge: false,
		baRank: 5,
		manualSpeed: 0,
		kandarinHard: true,
		[leaguesData.playerMiscProperty]: null
	})
});

export default class Player {
	constructor (attributes = {}) {
		this.attackStyleSelected = 1;
		this.boostList = [];
		this.prayers = [];
		this.equipment = {};
		this.spell = null;
		this.customBonuses = new Array(14).fill(0);

		Object.assign(this, attributes);

		this.equipment = {};

		for (const slot of slots) {
			if (slot !== "2h") {
				this.equipment[slot] = { ...nullItem, slot };
			}
		}

		this.equipment.weapon = unarmed;

		this.equipment = {
			...this.equipment,
			...attributes.equipment
		};

		// Initializes the variable properties of Player to either the provided value (via `attributes`)
		// or simply assigns the default value assigned in `defaultPlayer`.
		for (const [playerProperty, defaultValueDefinition] of Object.entries(defaultPlayer)) {
			this[playerProperty] = {};

			for (const [propName, defaultValue] of Object.entries(defaultValueDefinition)) {
				this[playerProperty][propName] = attributes[playerProperty]?.[propName] ?? defaultValue;
			}
		}
	}

	equip (item) {
		if (!slots.includes(item.slot)) {
			return false;
		}

		if ((item.slot === "weapon" || item.slot === "2h") && item.category !== this.equipment.weapon.category) {
			if (item.category === "Bulwark" || item.category === "Gun") {
				this.attackStyleSelected = 0;
			}
			else {
				this.attackStyleSelected = 1;
			}
		}

		if (item.slot === "weapon" || item.slot === "2h") {
			this.misc.manualSpeed = 0;
		}

		if (item.slot === "2h") {
			this.equipment.weapon = item;
			this.unequip("shield");
		}
		else if (item.slot === "shield" && this.equipment.weapon.slot === "2h") {
			this.equipment[item.slot] = item;
			delete this.equipment[item.slot].slot;
			this.equip(unarmed);
		}
		else {
			// delete item.slot
			this.equipment[item.slot] = item;
			delete this.equipment[item.slot].slots;
		}
	}

	unequip (slot) {
		if (slots.includes(slot)) {
			this.equipment[slot] = { ...nullItem, slot };
		}
		if (slot === "weapon") {
			this.misc.manualSpeed = 0;
		}
	}

	addBoost (newBoostName) {
		if (!boostNameList.includes(newBoostName)) {
			throw new Error(`Invalid boost ${newBoostName}`);
		}

		// If the new boost modifies the stats the previously active boosts modify,
		// then disable all of them, as clicking a new one is supposed to supersede them.
		const boostNames = new Set(this.boostList);
		const newBoostStats = determineBoostStats(newBoostName);
		for (const boostName of boostNames) {
			const currentBoostStats = determineBoostStats(boostName);
			if (currentBoostStats.some(i => newBoostStats.includes(i))) {
				boostNames.delete(boostName);
			}
		}

		boostNames.add(newBoostName);

		this.boostList = [...boostNames];
	}

	removeBoost (boost) {
		const boostList = new Set(this.boostList);
		boostList.delete(boost);
		this.boostList = [...boostList];
	}

	clearBoosts () {
		this.boostList = [];
	}

	setAttackStyle (num) {
		const style = parseInt(num);
		if (style < this.allAttackStyles.length) {
			this.attackStyleSelected = style;
		}
	}

	setStat (stat, level) {
		this.stats[stat] = parseInt(level);
	}

	selectPrayer (prayer) {
		const prayerList = new PrayerBook().prayerList();

		if (prayerList.ranged.includes(prayer) || prayerList.magic.includes(prayer) || prayerList.melee.includes(prayer)) {
			this.clearPrayers();
			this.prayers.push(prayer);
		}
		else {
			const genericOldPrayers = [
				...prayerList.melee,
				...prayerList.ranged,
				...prayerList.magic
			];

			if (prayerList.attack.includes(prayer)) {
				const oldPrayers = [...genericOldPrayers, ...prayerList.attack];
				for (const oldprayer of oldPrayers) {
					this.deselectPrayer(oldprayer);
					this.prayers.push(prayer);
				}
			}
			else if (prayerList.strength.includes(prayer)) {
				const oldPrayers = [...genericOldPrayers, ...prayerList.strength];
				for (const oldprayer of oldPrayers) {
					this.deselectPrayer(oldprayer);
					this.prayers.push(prayer);
				}
			}
		}
	}

	deselectPrayer (prayer) {
		const prayers = new Set(this.prayers);
		prayers.delete(prayer);
		this.prayers = [...prayers];
	}

	clearPrayers () {
		this.prayers = [];
	}

	setSpell (spell) {
		this.spell = spell;
	}

	clearSpell () {
		this.spell = null;
	}

	setBonusCustom (bonusIndex, value) {
		const i = parseInt(bonusIndex);
		const bonusRaw = this.bonusesRaw[i];
		this.customBonuses[i] = parseInt(value) - bonusRaw;
	}

	clearCustomBonuses () {
		this.customBonuses = new Array(14).fill(0);
	}

	toggleCharge () {
		this.misc.charge = !this.misc.charge;
	}

	setMisc (attribute, value) {
		if (attribute in this.misc) {
			this.misc[attribute] = value;
		}
	}

	getMisc (attribute) {
		if (attribute in this.misc) {
			return this.misc[attribute];
		}
		else {
			return null;
		}
	}

	/**
	 * @param {boolean} flat
	 * @param {...string} slots
	 * @returns {string[]|Record<string, string>}
	 */
	extractEquipmentNames (flat, ...slots) {
		const result = {};
		for (const slot of slots) {
			if (!this.equipment[slot]) {
				continue;
			}

			result[slot] = this.equipment[slot].name;
		}

		return (flat) ? Object.values(result) : result;
	}

	clearEquipment () {
		for (const slot of slots) {
			this.unequip(slot);
		}
	}

	get bonusesRaw () {
		const bonuses = new Array(14).fill(0);
		for (let i = 0; i < bonusList.length; i++) {
			let bonus = 0;
			for (const slot of slots) {
				if (slot !== "2h") {
					bonus += this.equipment[slot].bonuses[i];
				}
			}

			bonuses[i] = bonus;
		}

		// Don't include ammo ranged strength for self-sufficient weapons
		const { names, categories } = equipmentExceptions.selfSufficientRangedWeapons;
		if (names.includes(this.equipment.weapon.name) || categories.includes(this.equipment.weapon.category)) {
			bonuses[11] -= this.equipment.ammo.bonuses[11];
		}

		return bonuses;
	}

	get bonuses () {
		return this.bonusesRaw.map((value, i) => value + this.customBonuses[i]);
	}

	get boostedStats () {
		return applyBoosts(this.stats, this.boostList);
	}

	get combat () {
		const base = 0.25 * (this.stats.defence + this.stats.hitpoints + Math.floor(this.stats.prayer / 2));
		const melee = 0.325 * (this.stats.attack + this.stats.strength);
		const range = 0.325 * Math.floor((3 * this.stats.ranged) / 2);
		const mage = 0.325 * Math.floor((3 * this.stats.magic) / 2);
		return Math.floor(base + Math.max(melee, range, mage));
	}

	get allAttackStyles () {
		const exceptions = equipmentExceptions.unconventionalWeaponAttackStyles;
		const exceptionData = exceptions.find(i => i.name === this.equipment.weapon.name);

		if (exceptionData) {
			return exceptionData.attackStyles;
		}
		else {
			return AttackStyles(this.equipment.weapon.category);
		}
	}

	get attackStyle () {
		return this.allAttackStyles[this.attackStyleSelected];
	}

	serialize () {
		// @todo return a proper definition instead of relying on JSON.stringify
		return JSON.parse(JSON.stringify(this));
	}

	// minify returns a manual diff of this.serialize() and an empty player
	// This allows a serialized player state to be stored as concisely as possible
	minimize () {
		const fullObj = this.serialize();
		const result = {};

		let sumCustom = 0;
		for (let i = 0; i <= 13; i++) {
			sumCustom += Math.abs(this.customBonuses[i]);
		}

		if (sumCustom > 0) {
			result.customBonuses = this.customBonuses;
		}

		if (fullObj.attackStyleSelected !== 1) {
			result.attackStyleSelected = fullObj.attackStyleSelected;
		}

		if (fullObj.spell !== null) {
			result.spell = fullObj.spell;
		}

		if (fullObj.boostList.length > 0) {
			result.boostList = fullObj.boostList;
		}

		if (fullObj.prayers.length > 0) {
			result.prayers = fullObj.prayers;
		}

		for (const stat of stats) {
			if (fullObj.stats[stat] !== defaultPlayer.stats[stat]) {
				result.stats ??= {};
				result.stats[stat] = fullObj.stats[stat];
			}
		}

		for (const attribute in fullObj.misc) {
			if (fullObj.misc[attribute] !== defaultPlayer.misc[attribute]) {
				result.misc ??= {};
				result.misc[attribute] = fullObj.misc[attribute];
			}
		}

		for (const slot in fullObj.equipment) {
			if (fullObj.equipment[slot].name) {
				result.equipment ??= {};
				result.equipment[slot] = fullObj.equipment[slot];
			}
		}

		return result;
	}
}
