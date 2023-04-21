import { Accuracy } from "./Accuracy.js";
import { HitFreqStore } from "./HitFreqStore.js";

export class SpecialAttacks {
	constructor (state, calcs) {
		this.state = state;
		this.calcs = calcs;
	}

	applySpec (specName) {
		switch (specName) {
			case "Slice and Dice":
				return this.dclaws();
			case "Puncture":
				return this.dds();
			case "Descent of Dragons":
				return this.dbow(true);
			case "Descent of Darkness":
				return this.dbow(false);
			case "Armadyl eye":
				return this.acb();
			case "Snapshot":
				return this.msb();
			case "Powershot":
				return this.magicLong();
			case "The Judgement":
				return this.ags();
			case "Healing Blade":
				return this.sgs();
			case "Warstrike":
				return this.bgs();
			case "Sweep":
				return this.chally();
			case "Immolate":
				return this.volatile();
			case "Toxic Siphon":
				return this.blowp();
			case "Smash":
				return this.dwh();
			case "Blood Sacrifice":
				return this.zgs();
		}
		return this.calcs;
	}

	dclaws () {
		const accCalc = new Accuracy(this.state, this.calcs);
		const dps = this.calcs;
		const max = this.calcs.maxList[0];
		const npcRoll = accCalc.npcRoll("Slash");
		const acc = accCalc.compareRolls(this.calcs.playerRoll, npcRoll);
		// const trueMax = (max - 1) + Math.trunc((max - 1) / 2) + 2 * Math.trunc((max - 1) / 4) + 1;
		const clawHitStore = new HitFreqStore();


		// distribution of first successful roll
		const max1 = max - 1;
		const min1 = Math.trunc(max / 2);
		for (let dmg = min1; dmg <= max1; dmg++) {
			// let dmgAll = dmg + Math.trunc(dmg / 2) + 2 * Math.trunc(dmg / 4)
			// newDist[dmgAll] += acc / (max1 - min1 + 1) / 2
			// newDist[dmgAll + 1] += acc / (max1 - min1 + 1) / 2
			clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4)], acc / (max1 - min1 + 1) / 2);
			clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4) + 1], acc / (max1 - min1 + 1) / 2);
		}
		let scalingAcc = (1 - acc);

		// distribution of second successful roll
		const max2 = Math.trunc(max * 7 / 8);
		const min2 = Math.trunc(max * 3 / 8);
		for (let dmg = min2; dmg <= max2; dmg++) {
			// let dmgAll = dmg + 2 * Math.trunc(dmg / 2)
			// newDist[dmgAll] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
			// newDist[dmgAll + 1] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
			clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2)], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
			clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2) + 1], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
		}
		scalingAcc = (1 - acc) * (1 - acc);


		// distribution of third successful roll
		const max3 = Math.trunc(max * 3 / 4);
		const min3 = Math.trunc(max * 1 / 4);
		for (let dmg = min3; dmg <= max3; dmg++) {
			// let dmgAll = 2 * dmg
			// newDist[dmgAll] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
			// newDist[dmgAll + 1] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
			clawHitStore.store([0, 0, dmg, dmg], (acc * scalingAcc) / (max3 - min3 + 1) / 2);
			clawHitStore.store([0, 0, dmg, dmg + 1], (acc * scalingAcc) / (max3 - min3 + 1) / 2);
		}
		scalingAcc = scalingAcc * (1 - acc);


		// distribution of fourth successful roll
		const max4 = Math.trunc(max * 5 / 4);
		const min4 = Math.trunc(max * 1 / 4);
		for (let dmg = min4; dmg <= max4; dmg++) {
			// let dmgAll = dmg
			// newDist[dmgAll] += (acc * scalingAcc) / (max4 - min4 + 1)
			clawHitStore.store([0, 0, 0, dmg], (acc * scalingAcc) / (max4 - min4 + 1));
		}
		scalingAcc = scalingAcc * (1 - acc);
		// newDist[0] += scalingAcc / 2
		// newDist[2] += scalingAcc / 2
		clawHitStore.store([0, 0, 0, 0], scalingAcc / 2);
		clawHitStore.store([0, 0, 1, 1], scalingAcc / 2);

		dps.hitStore = clawHitStore;
		dps.maxList = [max1, Math.trunc(max1 / 2), Math.trunc(max1 / 4), Math.trunc(max1 / 4) + 1];
		dps.accuracy = acc;
		dps.rawAcc = acc;
		return dps;
	}

	dds () {
		const dps = this.calcs;
		const accCalc = new Accuracy(this.state, this.calcs);
		const pRoll = Math.trunc(dps.playerRoll * 23 / 20);
		const npcRoll = accCalc.npcRoll("Slash");
		const max = Math.trunc(dps.maxHit * 23 / 20);

		const acc = accCalc.compareRolls(pRoll, npcRoll);

		const ddsHitStore = new HitFreqStore();

		let p1 = 0;
		let p2 = 0;
		for (let hit1 = 0; hit1 <= max; hit1++) {
			p1 = acc / (max + 1);
			if (hit1 === 0) {
				p1 += 1 - acc;
			}
			for (let hit2 = 0; hit2 <= max; hit2++) {
				p2 = acc / (max + 1);
				if (hit2 === 0) {
					p2 += 1 - acc;
				}
				ddsHitStore.store([hit1, hit2], p1 * p2);
			}
		}

		dps.hitStore = ddsHitStore;
		dps.rawAcc = acc;
		dps.accuracy = acc;
		dps.playerRoll = pRoll;
		dps.npcRoll = npcRoll;
		dps.maxList = [max, max];
		dps.maxHit = max + max;
		return dps;
	}

	dbow (dragon = true) {
		const dps = this.calcs;
		const minDmg = dragon ? 8 : 5;
		const maxDmg = 48;
		const acc = this.calcs.accuracy;
		const boost = dragon ? 15 : 13;
		const max = Math.trunc(dps.maxHit * boost / 10);

		const dbowHitStore = new HitFreqStore();

		dbowHitStore.store([minDmg], 1 - acc);
		for (let i = 0; i <= max; i++) {
			const dmg = Math.max(Math.min(i, maxDmg), minDmg);
			dbowHitStore.store([dmg], acc / (max + 1));
		}

		dps.maxHit = Math.min(max, maxDmg);
		dps.hitStore = dbowHitStore;
		return dps;
	}

	acb () {
		const accCalc = new Accuracy(this.state, this.calcs);
		const dps = this.calcs;
		const playerRoll = dps.playerRoll;
		const npcRoll = dps.npcRoll;

		const max = dps.maxHit;

		const newPRoll = playerRoll * 2;

		const acc = accCalc.compareRolls(newPRoll, npcRoll);

		const acbHitStore = new HitFreqStore();
		acbHitStore.store([0], 1 - acc);

		for (let i = 0; i <= max; i++) {
			acbHitStore.store([i], acc / (max + 1));
		}


		dps.hitStore = acbHitStore;
		dps.accuracy = acc;
		dps.rawAcc = acc;
		dps.playerRoll = newPRoll;
		return dps;
	}

	msb () {
		const dps = this.calcs;
		const strBonus = this.state.player.bonuses[11];
		const rangedLvl = this.state.player.boostedStats.ranged;
		const accCalc = new Accuracy(this.state, this.calcs);
		const playerRoll = Math.trunc(dps.playerRoll * 10 / 7);

		const acc = accCalc.compareRolls(playerRoll, dps.npcRoll);
		const max = Math.trunc(0.5 + (rangedLvl + 10) * (strBonus + 64) / 640);

		let p1 = 0;
		let p2 = 0;
		const msbHitStore = new HitFreqStore();
		for (let hit1 = 0; hit1 <= max; hit1++) {
			p1 = acc / (max + 1);
			if (hit1 === 0) {
				p1 += (1 - acc);
			}
			for (let hit2 = 0; hit2 <= max; hit2++) {
				p2 = acc / (max + 1);
				if (hit2 === 0) {
					p2 += (1 - acc);
				}
				msbHitStore.store([hit1, hit2], p1 * p2);
			}
		}

		dps.hitStore = msbHitStore;
		dps.maxList = [max, max];
		dps.maxHit = max + max;
		dps.accuracy = acc;
		dps.rawAcc = acc;
		return dps;
	}

	magicLong () {
		const dps = this.calcs;
		const strBonus = this.state.player.bonuses[11];
		const rangedLvl = this.state.player.boostedStats.ranged;

		const acc = 1;
		const max = Math.trunc(0.5 + (rangedLvl + 10) * (strBonus + 64) / 640);

		const mlbHitStore = new HitFreqStore();
		for (let hit = 0; hit <= max; hit++) {
			mlbHitStore.store([hit], 1 / (max + 1));
		}

		dps.hitStore = mlbHitStore;
		dps.maxList = [max];
		dps.maxHit = max;
		dps.accuracy = acc;
		dps.rawAcc = acc;
		return dps;
	}

	ags () {
		const dps = this.calcs;
		const playerRoll = dps.playerRoll * 2;
		const accCalc = new Accuracy(this.state, this.calcs);
		// let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
		const npcRoll = accCalc.npcRoll("Slash");

		const acc = accCalc.compareRolls(playerRoll, npcRoll);
		const max = Math.trunc(dps.maxHit * 1.375);

		const agsHitStore = new HitFreqStore();
		agsHitStore.store([0], 1 - acc);

		for (let dmg = 0; dmg <= max; dmg++) {
			agsHitStore.store([dmg], acc / (max + 1));
		}

		dps.maxHit = max;
		dps.maxList = [max];
		dps.rawAcc = acc;
		dps.accuracy = acc;
		dps.hitStore = agsHitStore;
		dps.npcRoll = npcRoll;
		dps.playerRoll = playerRoll;

		return dps;
	}

	sgs () {
		const dps = this.calcs;
		const playerRoll = dps.playerRoll * 2;
		const accCalc = new Accuracy(this.state, this.calcs);
		// let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
		const npcRoll = accCalc.npcRoll("Slash");

		const acc = accCalc.compareRolls(playerRoll, npcRoll);
		const max = Math.trunc(dps.maxHit * 1.1);

		const sgsHitStore = new HitFreqStore();
		sgsHitStore.store([0], 1 - acc);

		let eHealing = 0;
		let ePrayer = 0;
		for (let dmg = 0; dmg <= max; dmg++) {
			sgsHitStore.store([dmg], acc / (max + 1));
			eHealing += Math.max(10, Math.trunc(dmg / 2)) * acc / (max + 1);
			ePrayer += Math.max(5, Math.trunc(dmg / 4)) * acc / (max + 1);
		}


		dps.eHealing += eHealing;
		dps.ePrayer += ePrayer;
		dps.maxHit = max;
		dps.maxList = [max];
		dps.rawAcc = acc;
		dps.accuracy = acc;
		dps.hitStore = sgsHitStore;
		dps.npcRoll = npcRoll;
		dps.playerRoll = playerRoll;

		return dps;
	}

	bgs () {
		const dps = this.calcs;
		const playerRoll = dps.playerRoll * 2;
		const accCalc = new Accuracy(this.state, this.calcs);
		// let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dcrush)
		const npcRoll = accCalc.npcRoll("Slash");

		const acc = accCalc.compareRolls(playerRoll, npcRoll);
		const def = this.state.monster.stats.def;
		const max = Math.trunc(Math.trunc(dps.maxHit * 1.1) * 1.1);

		const bgsHitStore = new HitFreqStore();
		bgsHitStore.store([0], (1 - acc));

		let eDefReduction = 0;
		if (dps.flags.includes("Tekton")) {
			eDefReduction += Math.min(def, 10) * (1 - acc);
		}

		for (let dmg = 0; dmg <= max; dmg++) {
			bgsHitStore.store([dmg], acc / (max + 1));
			eDefReduction += Math.min(def, dmg) * acc / (max + 1);
		}

		dps.hitStore = bgsHitStore;
		dps.eDefReduction += eDefReduction;
		dps.playerRoll = playerRoll;
		dps.npcRoll = npcRoll;
		dps.accuracy = acc;
		dps.rawAcc = acc;
		dps.maxHit = max;
		dps.maxList = [max];
		return dps;
	}

	zgs () {
		const dps = this.calcs;
		const playerRoll = dps.playerRoll * 2;
		const accCalc = new Accuracy(this.state, this.calcs);
		// let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dcrush)
		const npcRoll = accCalc.npcRoll("Slash");
		const acc = accCalc.compareRolls(playerRoll, npcRoll);
		const max = Math.trunc(dps.maxHit * 1.1);

		const zgsHitStore = new HitFreqStore();
		zgsHitStore.store([0], (1 - acc));

		for (let dmg = 0; dmg <= max; dmg++) {
			zgsHitStore.store([dmg, 25], acc / (max + 1));
		}

		dps.hitStore = zgsHitStore;
		dps.playerRoll = playerRoll;
		dps.npcRoll = npcRoll;
		dps.accuracy = acc;
		dps.rawAcc = acc;
		dps.maxHit = max;
		dps.maxHitSpec = 25;
		dps.maxList = [max];
		dps.eHealing = 25 * acc;
		return dps;
	}

	chally () {
		const dps = this.calcs;
		const max = Math.trunc(dps.maxHit * 11 / 10);


		const accCalc = new Accuracy(this.state, this.calcs);
		// let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
		const npcRoll = accCalc.npcRoll("Slash");
		const acc1 = accCalc.compareRolls(dps.playerRoll, npcRoll);
		const acc2 = accCalc.compareRolls(Math.trunc(dps.playerRoll * 3 / 4), npcRoll);

		const challyHitStore = new HitFreqStore();
		let p1 = 0;
		let p2 = 0;
		for (let hit1 = 0; hit1 <= max; hit1++) {
			p1 = acc1 / (max + 1);
			if (hit1 === 0) {
				p1 += 1 - acc1;
			}
			for (let hit2 = 0; hit2 <= max; hit2++) {
				p2 = acc2 / (max + 1);
				if (hit2 === 0) {
					p2 += 1 - acc2;
				}
				challyHitStore.store([hit1, hit2], p1 * p2);
			}
		}


		dps.hitStore = challyHitStore;
		dps.accuracy = acc1;
		dps.rawAcc = acc1;
		dps.npcRoll = npcRoll;
		dps.maxHit = max + max;
		dps.maxList = [max, max];

		return dps;
	}

	volatile () {
		const dps = this.calcs;
		const playerRoll = Math.trunc(dps.playerRoll * 1.5);
		const accCalc = new Accuracy(this.state, this.calcs);
		const acc = accCalc.compareRolls(playerRoll, dps.npcRoll);

		dps.accuracy = acc;
		dps.rawAcc = acc;

		return dps;
	}

	blowp () {
		const dps = this.calcs;
		const max = Math.trunc(dps.maxHit * 3 / 2);
		const acc = dps.accuracy;

		const blowpHitStore = new HitFreqStore();
		blowpHitStore.store([0], 1 - acc);

		let eHealing = 0;
		for (let dmg = 0; dmg <= max; dmg++) {
			blowpHitStore.store([dmg], acc / (max + 1));
			eHealing += Math.trunc(dmg / 2) * acc / (max + 1);
		}

		dps.hitStore = blowpHitStore;
		dps.maxList = [max];
		dps.maxHit = max;
		dps.eHealing += eHealing;
		return dps;
	}

	dwh () {
		const dps = this.calcs;
		const max = Math.trunc(dps.maxHit * 3 / 2);
		const acc = dps.accuracy;
		const def = this.state.monster.stats.def;

		const dwhHitStore = new HitFreqStore();
		dwhHitStore.store([0], 1 - acc);

		let eDefReduction = 0;
		if (dps.flags.includes("Tekton")) {
			eDefReduction += Math.trunc(def / 10) * (1 - acc);
		}
		eDefReduction += Math.trunc(def * 3 / 10) * acc;

		for (let dmg = 0; dmg <= max; dmg++) {
			dwhHitStore.store([dmg], acc / (max + 1));
		}

		dps.hitStore = dwhHitStore;
		dps.eDefReduction += eDefReduction;
		dps.maxList = [max];
		dps.maxHit = max;
		return dps;
	}
}
