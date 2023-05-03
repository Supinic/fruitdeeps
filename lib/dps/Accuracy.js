// Melee, ranged, and magic methods are turbo redundant but I think it increases readability that way
import { PrayerBook } from "../PrayerBook.js";
import {
	modifyEffectiveAttackLevel,
	modifyAccuracy,
	modifyPlayerBonus,
	modifyNpcDefenceRoll
} from "./ConditionalModifiers.js";

export function generalFormula (a, b) {
	return a * (b + 64);
}

export function compareRolls (atk, def) {
	if (atk > def) {
		return Math.max(0, Math.min(1, 1 - (def + 2) / (2 * (atk + 1))));
	}
	else {
		return Math.max(0, Math.min(1, atk / (2 * (def + 1))));
	}
}

export class Accuracy {
	constructor (stateObj, calcs) {
		this.calcs = calcs;
		this.vertex = calcs.vertex;
		this.state = stateObj;

		const prayerBook = new PrayerBook();
		this.prayerModifiers = prayerBook.getModifiers(this.state.player.prayers);
	}

	generalFormula (a, b) {
		return generalFormula(a, b);
	}

	compareRolls (atk, def) {
		return compareRolls(atk, def);
	}

	melee () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;
		const attackType = player.attackStyle.type;

		let effectiveAtt = player.boostedStats.attack;
		effectiveAtt = Math.floor(effectiveAtt * this.prayerModifiers.attack);

		let stanceBonus = 8;
		if (attackStyle === "Accurate") {
			stanceBonus += 3;
		}
		else if (attackStyle === "Controlled") {
			stanceBonus += 1;
		}

		effectiveAtt += stanceBonus;
		effectiveAtt = modifyEffectiveAttackLevel(effectiveAtt, this.calcs, this.state.player, this.state.monster);

		let playerBonus = 0;
		if (attackType === "Stab") {
			playerBonus = player.bonuses[0];
		}
		else if (attackType === "Slash") {
			playerBonus = player.bonuses[1];
		}
		else if (attackType === "Crush") {
			playerBonus = player.bonuses[2];
		}

		playerBonus = modifyPlayerBonus(playerBonus, this.calcs, this.state.player, this.state.monster);

		let playerRoll = this.generalFormula(effectiveAtt, playerBonus);
		playerRoll = modifyAccuracy(playerRoll, this.calcs, this.state.player, this.state.monster);

		return playerRoll;
	}

	ranged () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;

		let effectiveRanged = player.boostedStats.ranged;
		effectiveRanged = Math.floor(effectiveRanged * this.prayerModifiers.rangedAcc);

		let stanceBonus = 8;
		if (attackStyle === "Accurate") {
			stanceBonus += 3;
		}

		effectiveRanged += stanceBonus;
		effectiveRanged = modifyEffectiveAttackLevel(effectiveRanged, this.calcs, this.state.player, this.state.monster);

		let playerBonus = player.bonuses[4]; // ranged attack
		playerBonus = modifyPlayerBonus(playerBonus, this.calcs, this.state.player, this.state.monster);

		let playerRoll = this.generalFormula(effectiveRanged, playerBonus);
		playerRoll = modifyAccuracy(playerRoll, this.calcs, this.state.player, this.state.monster);

		return playerRoll;
	}

	magic () {
		const player = this.state.player;
		const attackStyle = player.attackStyle.style;
		const attackType = player.attackStyle.type;

		let effectiveMagic = player.boostedStats.magic;
		effectiveMagic = Math.floor(effectiveMagic * this.prayerModifiers.magic);

		// This is seemingly correct according to BK DPS sheet - the magic attack level bonuses are calculated first,
		// (unlike Melee and Ranged) and only then the flat +9 (+11 if Accurate) bonuses are applied.
		effectiveMagic = modifyEffectiveAttackLevel(effectiveMagic, this.calcs, this.state.player, this.state.monster);

		let stanceBonus = 9;
		if (!player.spell && attackType === "Magic" && attackStyle === "Accurate") {
			stanceBonus += 2;
		}

		effectiveMagic += stanceBonus;

		let playerBonus = player.bonuses[3]; // magic attack
		playerBonus = modifyPlayerBonus(playerBonus, this.calcs, this.state.player, this.state.monster);

		let playerRoll = this.generalFormula(effectiveMagic, playerBonus);
		playerRoll = modifyAccuracy(playerRoll, this.calcs, this.state.player, this.state.monster);

		return playerRoll;
	}

	npcRoll (type) {
		const monster = this.state.monster;
		let npcBonus = 0;
		let roll = 0;

		switch (type) {
			case "Stab":
				npcBonus = monster.stats.dstab;
				roll = this.generalFormula(monster.stats.def + 9, npcBonus);
				break;

			case "Slash":
				npcBonus = monster.stats.dslash;
				roll = this.generalFormula(monster.stats.def + 9, npcBonus);
				break;

			case "Crush":
				npcBonus = monster.stats.dcrush;
				roll = this.generalFormula(monster.stats.def + 9, npcBonus);
				break;

			case "Ranged":
				roll = this.generalFormula(monster.stats.def + 9, monster.stats.drange);
				break;

			case "Magic":
				roll = this.generalFormula(monster.stats.mage + 9, monster.stats.dmagic);
				break;
		}

		roll = modifyNpcDefenceRoll(roll, this.calcs, this.state.player, this.state.monster);
		return roll;
	}

	output () {
		let accuracyRoll = 0;
		if (this.vertex === "Melee") {
			accuracyRoll = this.melee();
		}
		else if (this.vertex === "Ranged") {
			accuracyRoll = this.ranged();
		}
		else if (this.vertex === "Magic") {
			accuracyRoll = this.magic();
		}

		if (accuracyRoll < 0) {
			accuracyRoll = 0;
		}

		return accuracyRoll;
	}
}
