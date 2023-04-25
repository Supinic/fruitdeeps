import { isApplied as hasVoid } from "./void.js";

const tierThreeRelics = {
	Ranged: "Quick Shot",
	Magic: "Double Cast",
	Melee: "Fluid Strikes"
};

const tierThreeBonuses = {
	Ranged: {
		accuracy: 1.00,
		damage: 0.10
	},
	Melee: {
		accuracy: 0.25,
		damage: 0
	},
	Magic: {
		accuracy: 1.25,
		damage: 0
	}
};

const tierSixBonus = {
	accuracy: 0.10,
	damage: 0.10
};

export function modifyAttackSpeed (speed, dps, player) {
	if (player.misc.tier6relic) {
		return speed - Math.floor(speed / 2);
	}

	return speed;
}

export function modifyMaxHit (maxHit, dps, player) {
	let modifier = 1;
	const { tier3relic, tier6relic } = player.misc;

	if (tier6relic) {
		modifier += tierSixBonus.damage;
	}

	if (tierThreeRelics[dps.vertex] === tier3relic) {
		modifier += tierThreeBonuses[dps.vertex].damage;
	}

	return Math.floor(maxHit * modifier);
}

export function modifyAccuracy (roll, dps, player) {
	let modifier = 1;
	const { tier3relic, tier6relic } = player.misc;

	if (tier6relic) {
		modifier += tierSixBonus.accuracy;
	}

	if (tierThreeRelics[dps.vertex] === tier3relic) {
		modifier += tierThreeBonuses[dps.vertex].accuracy;
	}

	return Math.floor(roll * modifier);
}

// 100% chance to hit enemies with >60 magic attack or >20 magic attack with Mage void on.
// Source: {@link https://oldschool.runescape.wiki/w/Trailblazer_League#Tier_3_(2,000_points)}
export function changeAttackRoll (acc, dps, player) {
	if (dps.vertex !== "Magic") {
		return acc;
	}

	const magicAccuracy = player.bonuses[3];
	if (magicAccuracy > 60) {
		return 1;
	}
	else if (hasVoid(dps, player) && magicAccuracy > 20) {
		return 1;
	}
	else {
		return acc;
	}
}

export function isApplied (dps, player) {
	const { tier3relic, tier6relic } = player.misc;
	if (tier6relic) {
		return true;
	}
	else if (!tier3relic) {
		return false;
	}

	const { vertex } = dps;
	return (tierThreeRelics[vertex] === tier3relic);
}
