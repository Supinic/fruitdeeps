// All calculations sourced from Oldschool Wiki:
// https://oldschool.runescape.wiki/w/Dragon_claws#Special_attack
// Source of the overall Dragon Claws mechanics:
// https://twitter.com/JagexAsh/status/791612951614619648 (https://archive.is/ZqLuy)
// Source of the "added 1 max hit for variety" mechanic:
// https://twitter.com/JagexAsh/status/843515187609174017 (https://archive.is/kn7Co)

import { Accuracy } from "../Accuracy.js";
import { HitTracker } from "../HitTracker.js";

export function apply (dps, state) {
	const accCalc = new Accuracy(state, dps);
	const max = dps.maxList[0];

	const npcRoll = accCalc.npcRoll("Slash");
	const acc = accCalc.compareRolls(dps.playerRoll, npcRoll);

	const clawHitStore = new HitTracker();

	// Accuracy roll #1: All attacks hit.
	// First hit will deal between 1 damage point less and 1/2 of an ordinary maximum hit.
	const max1 = max - 1;
	const min1 = Math.trunc(max / 2);
	for (let dmg = min1; dmg <= max1; dmg++) {
		// The second hit will deal half of the first hit.
		const half = Math.trunc(dmg / 2);
		// The third hit will deal half of the second.
		const quarter = Math.trunc(dmg / 4);

		// The fourth hit will, at random, deal either the same damage as the third hit, or 1 more damage than the third hit.
		const coinflipAccuracy = acc / (max1 - min1 + 1) / 2;
		clawHitStore.store([dmg, half, quarter, quarter], coinflipAccuracy);
		clawHitStore.store([dmg, half, quarter, quarter + 1], coinflipAccuracy);
	}

	// Scale accuracy down to represent incrementally unlikely misses.
	let scalingAcc = (1 - acc);

	// Accuracy roll #2: One attack misses, three attacks hit.
	// First hit is zero, the second hit will deal between about 3/8 and 7/8 of the ordinary maximum hit.
	const max2 = Math.trunc(max * 7 / 8);
	const min2 = Math.trunc(max * 3 / 8);
	for (let dmg = min2; dmg <= max2; dmg++) {
		// The third hit will deal half of the second hit.
		const half = Math.trunc(dmg / 2);
		// The fourth hit will, at random, deal either the same damage as the third hit, or 1 more damage than the third hit.
		const coinflipAccuracy = (acc * scalingAcc) / (max2 - min2 + 1) / 2;

		clawHitStore.store([0, dmg, half, half], coinflipAccuracy);
		clawHitStore.store([0, dmg, half, half + 1], coinflipAccuracy);
	}

	scalingAcc *= (1 - acc);

	// Accuracy roll #3: Two attacks miss, two attacks hit.
	// First and second hits are zero, the third hit will deal between about 1/4 and 3/4 of the ordinary maximum hit.
	const max3 = Math.trunc(max * 3 / 4);
	const min3 = Math.trunc(max * 1 / 4);
	for (let dmg = min3; dmg <= max3; dmg++) {
		// The fourth hit will, at random, deal either the same damage as the third hit, or 1 more damage than the third hit.
		const coinflipAccuracy = (acc * scalingAcc) / (max3 - min3 + 1) / 2;

		clawHitStore.store([0, 0, dmg, dmg], coinflipAccuracy);
		clawHitStore.store([0, 0, dmg, dmg + 1], coinflipAccuracy);
	}

	scalingAcc *= (1 - acc);

	// Accuracy roll #4: Three attacks miss, one attack hits.
	// First three hits are zero, the last hit will deal between 0.25x and 1.25x of the ordinary maximum hit.
	const max4 = Math.trunc(max * 5 / 4);
	const min4 = Math.trunc(max * 1 / 4);
	for (let dmg = min4; dmg <= max4; dmg++) {
		clawHitStore.store([0, 0, 0, dmg], (acc * scalingAcc) / (max4 - min4 + 1));
	}

	scalingAcc *= (1 - acc);

	// Accuracy roll #5: All attacks miss.
	// There is a 50/50 chance of rolling 0-0-1-1 or 0-0-0-0.
	clawHitStore.store([0, 0, 1, 1], scalingAcc / 2);
	clawHitStore.store([0, 0, 0, 0], scalingAcc / 2);

	dps.hitStore = clawHitStore;
	dps.accuracy = acc;
	dps.rawAcc = acc;

	// The absolute max hit is taken from the first roll, where all attacks hit.
	dps.maxList = [max1, Math.trunc(max1 / 2), Math.trunc(max1 / 4), Math.trunc(max1 / 4) + 1];

	return dps;
}
