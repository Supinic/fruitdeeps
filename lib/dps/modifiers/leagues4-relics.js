import { HitFreqStore } from "../HitFreqStore.js";
import leaguesData from "../../../game-data/leagues4.json" assert { type: "json" };

// @todo implement bolt chance improvement

const combatBonuses = {
	Ranged: {
		accuracy: 1.00,
		damage: 0.10 // @todo remove this if double projectile is implemented
	},
	Melee: {
		accuracy: 0.50,
		damage: 0
	},
	Magic: {
		accuracy: 1.75,
		damage: 0.20
	}
};
const { playerMiscProperty } = leaguesData;

export function modifyAttackSpeed (speed, dps, player) {
	const relic = player.misc[playerMiscProperty];
	if (dps.vertex !== relic) {
		return speed;
	}
	else if (speed >= 4) {
		return Math.floor(speed / 2);
	}
	else {
		return Math.ceil(speed / 2);
	}
}

export function modifyMaxHit (maxHit, dps, player) {
	let modifier = 1;
	const relic = player.misc[playerMiscProperty];
	if (dps.vertex === relic) {
		modifier += combatBonuses[relic].damage;
	}

	return Math.floor(maxHit * modifier);
}

export function modifyAccuracy (roll, dps, player) {
	let modifier = 1;
	const relic = player.misc[playerMiscProperty];
	if (dps.vertex === relic) {
		modifier += combatBonuses[relic].accuracy;
	}

	return Math.floor(roll * modifier);
}

export function applyModifier (dps) {
	if (dps.vertex === "Melee") {
		const procChance = 0.10;
		const normalChance = (1 - procChance);

		const maxHit = dps.maxHit;
		const acc = dps.accuracy;
		const critStore = new HitFreqStore();
		critStore.store([0], 1 - acc);

		for (let dmg = 0; dmg <= maxHit; dmg++) {
			critStore.store([dmg], normalChance * acc / (maxHit + 1));
			critStore.store([dmg * 2], procChance * acc / ((dmg * 2) + 1));
		}

		dps.hitStore = critStore;
		dps.maxHitSpec = Math.floor(dps.maxHit * 2.00);

		return dps;
	}
	else if (dps.vertex === "Ranged") {
		return dps;
	}
	else {
		return dps;
	}
}

export function isApplied (dps, player) {
	return (dps.vertex === player.misc[playerMiscProperty]);
}
