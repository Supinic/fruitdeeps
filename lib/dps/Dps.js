import { getFlagList } from "./Flags.js";
import { MaxHit } from "./MaxHit.js";
import { Accuracy } from "./Accuracy.js";
import { AttackSpeed } from "./AttackSpeed.js";
import { ConditionalModifiers } from "./ConditionalModifiers.js";
import { HitFreqStore } from "./HitFreqStore.js";
import Player from "../Player.js";

import applySpecialAttack from "./SpecialAttacks.js";

export class Dps {
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

	setFlags () {
		this.calcs.flags = getFlagList(this.calcs, this.state.player, this.state.monster);
	}

	setMaxHit () {
		const max = new MaxHit(this.state, this.calcs);

		this.calcs.maxHit = max.output();
		this.calcs.maxList = [this.calcs.maxHit];
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

		// @todo use modifyRawAccuracy here

		this.calcs.accuracy = acc.compareRolls(this.calcs.playerRoll, this.calcs.npcRoll);
		if (this.calcs.flags.includes("Double Cast Bug Abuse")) {
			this.calcs.accuracy = 1;
		}

		if (this.calcs.flags.includes("Brimstone ring")) {
			this.calcs.accuracy = 0.75 * this.calcs.accuracy + 0.25 * acc.compareRolls(this.calcs.playerRoll, Math.ceil(this.calcs.npcRoll * 9 / 10));
		}

		this.calcs.rawAcc = this.calcs.accuracy;
	}

	setAttackSpeed () {
		const speed = new AttackSpeed(this.state, this.calcs);
		this.calcs.attackSpeed = speed.output();
	}

	setHitDist () {
		const acc = this.calcs.accuracy;
		const max = this.calcs.maxHit;
		const hp = this.state.monster.stats.hitpoints;

		let hitStore = new HitFreqStore();
		hitStore.store([0], 1 - acc);

		for (let dmg = 0; dmg <= max; dmg++) {
			hitStore.store([dmg], acc / (max + 1));
		}

		this.calcs.hitStore = hitStore;

		this.applyConditionals();

		hitStore = this.calcs.hitStore;

		const hitList = hitStore.getFreqs();
		const hitDist = [];

		for (let index = 0; index < hitList.length; index++) {
			const hit = hitList[index];
			let sum = 0;

			for (let hitNum = 0; hitNum < hit.dmg.length; hitNum++) {
				sum += hit.dmg[hitNum];
			}

			if (hitDist[sum] === undefined) {
				hitDist[sum] = hit.p;
			}
			else {
				hitDist[sum] += hit.p;
			}
		}

		for (let hit = 0; hit < hitDist.length; hit++) {
			hitDist[hit] ??= 0;
		}

		let newDist = hitDist;
		if (hitDist.length > (hp + 1)) {
			newDist = new Array(hp + 1).fill(0);
			for (let dmg = 0; dmg < hitDist.length; dmg++) {
				if (dmg > hp) {
					newDist[hp] += hitDist[dmg];
				}
				else {
					newDist[dmg] += hitDist[dmg];
				}
			}
		}

		let maxHit = 0;
		for (let i = 0; i < this.calcs.maxList.length; i++) {
			maxHit += this.calcs.maxList[i];
		}

		this.calcs.maxHit = maxHit;
		this.calcs.npcHp = hp;
		this.calcs.hitDist = newDist;
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
	}

	setAccOverOne () {
		this.calcs.acc1plus = 1 - this.calcs.hitDist[0];
	}

	applyConditionals () {
		// const specs = new ConditionalModifiers(this.state, this.calcs);
		// @todo apply applyModifier calls here

		if (this.calcs.specName) {
			this.calcs = applySpecialAttack(this.calcs.specName, this.calcs, this.state);
		}
	}

	output () {
		const weapon = this.state.player.equipment.weapon.name;
		const spec = this.pickSpec(weapon);

		this.setVertex();
		this.setFlags();
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
}
