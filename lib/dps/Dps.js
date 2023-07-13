import { MaxHit } from "./MaxHit.js";
import { Accuracy } from "./Accuracy.js";
import { AttackSpeed } from "./AttackSpeed.js";
import { changeAttackRoll, applyModifier } from "./ConditionalModifiers.js";
import { HitTracker, MultiHitTracker } from "./HitTracker.js";
import Player from "../Player.js";

import applySpecialAttack from "./SpecialAttacks.js";

/**
 * Calculates a set of DPS values for given defence value points.
 * This is more efficient - as only one DPS object is created for this purpose, and then reused as much as possible.
 * Solely used for the purpose of creating per-defence DPS graphs.
 * @param {Player} player
 * @param {Object} inputMonster
 * @param {Iterable<number>} defencePoints
 * @returns {Map<number, number>}
 *
 * @todo The DPS class re-calculation itself can become more efficient, as right now all conditional modifiers are re-calculated. This is not really necessary, as only the monster's defence value is modified, so everything aside from accuracy stays exactly the same.
 */
export function calculateDpsPerDefenceList (player, inputMonster, defencePoints) {
	// Do not mutate the input monster object (ideally, a better solution than JSON is found)
	const monster = JSON.parse(JSON.stringify(inputMonster));
	const defDps = new Dps({ player, monster });

	// "Dry run" the DPS object to initialize it
	defDps.output();

	const result = new Map();
	for (const defence of defencePoints) {
		defDps.state.monster.stats.def = defence;

		defDps.setMaxHit();
		defDps.setAccuracy();
		defDps.setHitDist();
		defDps.setDps();

		result.set(defence, defDps.calcs.dps);
	}

	return result;
}

export class Dps {
	#calculated = new Map();

	constructor (stateObj) {
		this.state = {
			...stateObj,
			player: new Player(stateObj.player)
		};

		this.calcs = {
			vertex: "Melee",
			flags: [],
			maxHit: 0,
			accuracy: 0,
			attackSpeed: 1,
			dps: 0,
			acc1plus: 0,
			overhit1: 0,
			overhit2: 0,
			hitpoints: this.state.monster.stats.hitpoints,
			specName: null,
			specCalcs: null,
			eHealing: 0,
			ePrayer: 0,
			eDefReduction: 0
		};
	}

	pickSpec (weapon) {
		switch (weapon) {
			case "Dragon claws":
				return "Slice and Dice";

			case "Dragon dagger (Unpoisoned)":
			case "Dragon dagger (Poison)":
			case "Dragon dagger (Poison+)":
			case "Dragon dagger (Poison++)":
				return "Puncture";

			case "Dark bow":
			case "Dark bow (Yellow)":
			case "Dark bow (Blue)":
			case "Dark bow (White)":
			case "Dark bow (Green)":
				return this.state.player.equipment.ammo.name.includes("Dragon") ? "Descent of Dragons" : "Descent of Darkness";
			case "Armadyl crossbow":
				return "Armadyl eye";

			case "Magic shortbow":
			case "Magic shortbow (i)":
				return "Snapshot";

			case "Magic longbow":
			case "Magic comp bow":
				return "Powershot";

			case "Armadyl godsword":
			case "Armadyl godsword (or)":
				return "The Judgement";

			case "Saradomin godsword":
			case "Saradomin godsword (or)":
				return "Healing Blade";

			case "Bandos godsword":
			case "Bandos godsword (or)":
				return "Warstrike";

			case "Crystal halberd":
			case "Dragon halberd":
				return "Sweep";
			case "Dragon warhammer":
				return "Smash";
			case "Ancient godsword":
				return "Blood Sacrifice";

			case "Osmumten's fang":
			case "Osmumten's fang (or)":
				return "Eviscerate";
		}

		if (weapon.includes("Toxic blowpipe")) {
			return "Toxic Siphon";
		}

		return null;
	}

	setSpecName (name) {
		this.calcs.specName = name;
	}

	setVertex () {
		const type = this.state.player.attackStyle.type;
		const style = this.state.player.attackStyle.style;
		const spell = this.state.player.spell;

		if (spell || type === "Magic") {
			this.calcs.vertex = "Magic";
			this.calcs.attackType = "Magic";

			if (type === "Magic") {
				this.calcs.attackStyle = style;
			}
			else if (spell) {
				this.calcs.attackStyle = "Spell";
			}
		}
		else if (type === "Ranged") {
			this.calcs.vertex = "Ranged";
			this.calcs.attackType = "Ranged";
			this.calcs.attackStyle = style;
		}
		else {
			this.calcs.vertex = "Melee";
			this.calcs.attackType = type;
			this.calcs.attackStyle = style;
		}
	}

	setMaxHit () {
		const max = new MaxHit(this.state, this.calcs);

		this.calcs.maxHit = max.output();
		this.calcs.maxList = [this.calcs.maxHit];

		this.#calculated.set("maxHit", true);
	}

	setAccuracy () {
		const acc = new Accuracy(this.state, this.calcs);
		this.calcs.playerRoll = acc.output();

		if (this.calcs.vertex === "Melee") {
			this.calcs.npcRoll = acc.npcRoll(this.state.player.attackStyle.type);
		}
		else {
			this.calcs.npcRoll = acc.npcRoll(this.calcs.vertex);
		}

		this.calcs.accuracy = acc.compareRolls(this.calcs.playerRoll, this.calcs.npcRoll);
		this.calcs.accuracy = changeAttackRoll(this.calcs.accuracy, this.calcs, this.state.player, this.state.monster);

		this.calcs.rawAcc = this.calcs.accuracy;

		this.#calculated.set("accuracy", true);
	}

	setAttackSpeed () {
		const speed = new AttackSpeed(this.state, this.calcs);
		this.calcs.attackSpeed = speed.output();

		this.#calculated.set("attackSpeed", true);
	}

	setHitDist () {
		const acc = this.calcs.accuracy;
		const max = this.calcs.maxHit;

		// Assume a single-hit basic-distribution weapon, since that's the game's vast majority.
		this.calcs.hitStore = new HitTracker().createBasicDistribution(max, acc);

		// This call can possibly mutate the `hitStore` property
		this.applyConditionals();

		const { hitStore } = this.calcs;

		// Clamp damage to monster's maximum HP, if it is exceeded
		const hp = this.state.monster.stats.hitpoints;
		if (hitStore.maxHit > hp) {
			hitStore.clamp(hp);
		}

		let distribution;
		if (hitStore instanceof HitTracker) {
			distribution = hitStore.getFinalDistribution();
		}
		else if (hitStore instanceof MultiHitTracker) {
			distribution = hitStore.combine().getFinalDistribution();
		}

		this.calcs.npcHp = hp;
		this.calcs.maxHit ??= hitStore.maxHit;
		this.calcs.maxList ??= hitStore.maxList;

		this.calcs.hitDist = [];
		for (const [damage, p] of distribution.entries()) {
			this.calcs.hitDist[damage] = p;
		}

		this.#calculated.set("hitDistribution", true);
	}

	setDps () {
		const speed = this.calcs.attackSpeed;
		const hitDist = this.calcs.hitDist;

		let dps = 0;
		let eDmg = 0;

		for (let dmg = 0; dmg < hitDist.length; dmg++) {
			dps += dmg * hitDist[dmg] / speed / 0.6;
			eDmg += dmg * hitDist[dmg];
		}

		this.calcs.eDmg = eDmg;
		this.calcs.dps = dps;

		this.#calculated.set("dps", true);
	}

	setAccOverOne () {
		this.calcs.acc1plus = 1 - this.calcs.hitDist[0];
	}

	applyConditionals () {
		this.calcs = applyModifier(this.calcs, this.state.player, this.state.monster);

		if (this.calcs.specName) {
			this.calcs = applySpecialAttack(this.calcs.specName, this.calcs, this.state);
		}
	}

	output () {
		const weapon = this.state.player.equipment.weapon.name;
		const spec = this.pickSpec(weapon);

		this.setVertex();
		this.setMaxHit();
		this.setAccuracy();
		this.setAttackSpeed();
		this.setHitDist();
		this.setDps();
		this.setAccOverOne();

		if (spec !== null && this.calcs.specName === null) {
			const specDps = new Dps(this.state);
			specDps.setSpecName(spec);
			this.calcs.specCalcs = specDps.output();
		}

		return this.calcs;
	}

	invalidate (operation) {
		if (!this.#calculated.has(operation)) {
			throw new Error("Operation does not exist or has not yet been calculated");
		}

		this.#calculated.set(operation, false);
	}

	alterState (path, value) {
		let target = this.state;
		for (let i = 0; i < path.length - 1; i++) {
			target = target[path[i]];
		}

		target[path.at(-1)] = value;
	}
}
