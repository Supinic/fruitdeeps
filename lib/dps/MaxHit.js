import { PrayerBook } from "../PrayerBook.js";
import { SpellBook } from "../SpellBook.js";
import {
	modifyEffectiveStrengthLevel,
	modifyMaxHit,
	getFlatMaxHitBonus,
	determineBaseMaxHit
} from "./ConditionalModifiers.js";

// MaxHit calculates a player's max hit from player and monster state
// Notes:
//  Melee and ranged max hit codes are very redundant
//  Can definitely generalize them a lot. Not sure if that will improve or diminish readability, however
//  I think that this should be done, eventually.

export function generalFormula (a, b) {
	return Math.floor(0.5 + a * (b + 64) / 640);
}

export class MaxHit {
	constructor (state, calcs) {
		this.state = state;

		// @todo verify if this is needed - in calls from ConditionalModifiers
		this.calcs = calcs;
		this.vertex = calcs.vertex;
		const prayerBook = new PrayerBook();
		this.prayerModifiers = prayerBook.getModifiers(this.state.player.prayers);
	}

	static generalFormula (a, b) {
		return generalFormula(a, b);
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
		effectiveStr = modifyEffectiveStrengthLevel(effectiveStr, this.calcs, player, this.state.monster);

		// Calc max hit
		let maxHit = MaxHit.generalFormula(effectiveStr, strBonus);
		maxHit = maxHit + getFlatMaxHitBonus(this.calcs, this.state.player, this.state.monster);
		maxHit = modifyMaxHit(maxHit, this.calcs, this.state.player, this.state.monster);

		return maxHit;
	}

	ranged () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;
		const strBonus = player.bonuses[11]; // ranged strength

		// Start with visible stats
		let effectiveStr = player.boostedStats.ranged;

		// apply prayer bonus
		effectiveStr = Math.floor(effectiveStr * this.prayerModifiers.rangedStr);

		// add attack style bonus
		if (attackStyle === "Accurate") {
			effectiveStr += 3;
		}

		effectiveStr += 8;
		effectiveStr = modifyEffectiveStrengthLevel(effectiveStr, this.calcs, player, this.state.monster);

		// Calc max hit
		let maxHit = MaxHit.generalFormula(effectiveStr, strBonus);
		maxHit = maxHit + getFlatMaxHitBonus(this.calcs, this.state.player, this.state.monster);
		maxHit = modifyMaxHit(maxHit, this.calcs, this.state.player, this.state.monster);

		return maxHit;
	}

	magic () {
		const spellBook = new SpellBook();
		const spell = this.state.player.spell;

		let dmgBonus = this.state.player.bonuses[12];
		dmgBonus = modifyEffectiveStrengthLevel(dmgBonus, this.calcs, this.state.player, this.state.monster);

		let maxHit;
		if (spell) {
			maxHit = spellBook.maxLookup(spell);
		}
		else {
			maxHit = determineBaseMaxHit(this.calcs, this.state.player, this.state.monster);
		}

		maxHit = Math.floor(maxHit * (100 + dmgBonus) / 100);
		maxHit = maxHit + getFlatMaxHitBonus(this.calcs, this.state.player, this.state.monster);
		maxHit = modifyMaxHit(maxHit, this.calcs, this.state.player, this.state.monster);

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
