import * as ahrim from "./modifiers/ahrims-set.js";
import * as barb from "./modifiers/barbarian-assault.js";
import * as brimstoneRing from "./modifiers/brimstone-ring.js";
import * as colossalBlade from "./modifiers/colossal-blade.js";
import * as corp from "./modifiers/corporeal-beast.js";
import * as crystal from "./modifiers/crystal-armour.js";
import * as darkBow from "./modifiers/dark-bow.js";
import * as demonbane from "./modifiers/demonbane.js";
import * as dharok from "./modifiers/dharoks-set.js";
import * as dragonbane from "./modifiers/dragonbane.js";
import * as guardians from "./modifiers/guardians.js";
import * as harmStaff from "./modifiers/harmonized-nightmare-staff.js";
import * as iceDemon from "./modifiers/ice-demon.js";
import * as inquisitors from "./modifiers/inquisitors-set.js";
import * as karil from "./modifiers/karils-set.js";
import * as keris from "./modifiers/keris.js";
import * as kerisBlue from "./modifiers/keris-partisan-of-breaching.js";
import * as leafy from "./modifiers/leafy.js";
import * as maidenNylo from "./modifiers/maiden-nylocas-freeze.js";
import * as mageFlat from "./modifiers/mage-flat.js";
import * as mageMult from "./modifiers/mage-mult.js";
import * as magicDart from "./modifiers/magic-dart.js";
import * as fang from "./modifiers/osmumtens-fang.js";
import * as obsidian from "./modifiers/obsidian.js";
import * as poweredStaves from "./modifiers/powered-staves.js";
import * as salamanders from "./modifiers/salamanders.js";
import * as salve from "./modifiers/salve.js";
import * as scythe from "./modifiers/scythe-of-vitur.js";
import * as slayerHelmets from "./modifiers/slayer-helmets.js";
import * as toa from "./modifiers/tombs-of-amascut.js";
import * as tbow from "./modifiers/twisted-bow.js";
import * as tumekensShadow from "./modifiers/tumekens-shadow.js";
import * as vampyre from "./modifiers/vampyrebane.js";
import * as verac from "./modifiers/veracs-set.js";
import * as verzik1 from "./modifiers/verzik-phase1.js";
import * as voidArmour from "./modifiers/void.js";
import * as wildernessWeapons from "./modifiers/wilderness-weapons.js";
import * as zulrah from "./modifiers/zulrah.js";

import * as bolts from "./modifiers/bolts/index.js";

const modifierList = [
	ahrim,
	barb,
	bolts,
	brimstoneRing,
	colossalBlade,
	corp,
	crystal,
	darkBow,
	demonbane,
	dharok,
	dragonbane,
	guardians,
	harmStaff,
	iceDemon,
	inquisitors,
	karil,
	keris,
	kerisBlue,
	leafy,
	maidenNylo,
	mageFlat,
	mageMult,
	magicDart,
	fang,
	obsidian,
	poweredStaves,
	salamanders,
	salve,
	scythe,
	slayerHelmets,
	tbow,
	toa,
	tumekensShadow,
	vampyre,
	verac,
	verzik1,
	voidArmour,
	wildernessWeapons,
	zulrah
];

const getModifierList = (fn, dps, player, monster) => (
	modifierList.filter(mod => typeof mod[fn] === "function" && mod.isApplied(dps, player, monster))
);

// Accuracy
export function modifyEffectiveAttackLevel (attackLevel, dps, player, monster) {
	const list = getModifierList("modifyEffectiveAttackLevel", dps, player, monster);
	for (const mod of list) {
		attackLevel = mod.modifyEffectiveAttackLevel(attackLevel, dps, player, monster);
	}

	return attackLevel;
}

export function modifyPlayerBonus (playerBonus, dps, player, monster) {
	const list = getModifierList("modifyPlayerBonus", dps, player, monster);
	for (const mod of list) {
		playerBonus = mod.modifyPlayerBonus(playerBonus, dps, player, monster);
	}

	return playerBonus;
}

export function modifyAccuracy (roll, dps, player, monster) {
	const list = getModifierList("modifyAccuracy", dps, player, monster);
	for (const mod of list) {
		roll = mod.modifyAccuracy(roll, dps, player, monster);
	}

	return roll;
}

export function modifyNpcDefenceRoll (roll, dps, player, monster) {
	const list = getModifierList("modifyNpcDefenceRoll", dps, player, monster);
	for (const mod of list) {
		roll = mod.modifyNpcDefenceRoll(roll, dps, player, monster);
	}

	return roll;
}

export function changeAttackRoll (roll, dps, player, monster) {
	const list = getModifierList("changeAttackRoll", dps, player, monster);
	for (const mod of list) {
		roll = mod.changeAttackRoll(roll, dps, player, monster);
	}

	return roll;
}

// Strength / max hits
export function modifyEffectiveStrengthLevel (bonus, dps, player, monster) {
	const list = getModifierList("modifyEffectiveStrengthLevel", dps, player, monster);
	for (const mod of list) {
		bonus = mod.modifyEffectiveStrengthLevel(bonus, dps, player, monster);
	}

	return bonus;
}

export function getFlatMaxHitBonus (dps, player, monster) {
	let extraMaxHit = 0;
	const list = getModifierList("getFlatMaxHitBonus", dps, player, monster);
	for (const mod of list) {
		extraMaxHit = mod.getFlatMaxHitBonus(extraMaxHit, dps, player, monster);
	}

	return extraMaxHit;
}

export function modifyMaxHit (maxHit, dps, player, monster) {
	const list = getModifierList("modifyMaxHit", dps, player, monster);
	for (const mod of list) {
		maxHit = mod.modifyMaxHit(maxHit, dps, player, monster);
	}

	return maxHit;
}

export function determineBaseMaxHit (dps, player, monster) {
	const list = getModifierList("determineBaseMaxHit", dps, player, monster);
	if (list.length === 0) {
		return 0;
	}
	else if (list.length > 1) {
		throw new Error("Sanity check: More than one modifier for base max hit");
	}

	const [mod] = list;
	return mod.determineBaseMaxHit(dps, player, monster);
}

// Weapon speed
export function modifyAttackSpeed (speed, dps, player, monster) {
	const list = getModifierList("modifyAttackSpeed", dps, player, monster);
	for (const mod of list) {
		speed = mod.modifyAttackSpeed(speed, dps, player, monster);
	}

	return speed;
}

// Combined and/or complex effects
export function applyModifier (dps, player, monster) {
	let resultDpsObject = dps;
	const list = getModifierList("applyModifier", dps, player, monster);

	for (const mod of list) {
		resultDpsObject = mod.applyModifier(resultDpsObject, player, monster);
	}

	return resultDpsObject;
}
