import { Accuracy } from "../Accuracy.js";
import { HitFreqStore } from "../HitFreqStore.js";

export function apply (dps, state) {
	const playerRoll = dps.playerRoll * 2;
	const accCalc = new Accuracy(state, dps);
	const npcRoll = accCalc.npcRoll("Slash");
	const monsterName = state.monster.name;

	const acc = accCalc.compareRolls(playerRoll, npcRoll);
	const def = this.state.monster.stats.def;
	const max = Math.trunc(Math.trunc(dps.maxHit * 1.1) * 1.1);

	const bgsHitStore = new HitFreqStore();
	bgsHitStore.store([0], (1 - acc));

	let eDefReduction = 0;
	if (monsterName === "Tekton") {
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
