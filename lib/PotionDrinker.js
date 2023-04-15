/* PotionDrinker.js
 * Manages a list of potential boosts and their effects
 * Accepts a stat object and list of boosts and returns a boosted stat object
 */

const boosts = [
	"Attack",
	"Super attack",
	"Strength",
	"Super strength",
	"Zamorak brew",
	"Ranging",
	"Super ranging",
	"Magic",
	"Super magic",
	"Imbued heart",
	"Super combat",
	"Overload (+)",
	"Smelling salts"
];

const stats = ["attack", "strength", "ranged", "magic", "hitpoints", "prayer", "defence"];

export class PotionDrinker {
	constructor () {
		this.potionEffects = {
			Attack: (statObj) => ({
				...statObj,
				attack: statObj.attack + Math.floor(statObj.attack / 10) + 3
			}),

			"Super attack": (statObj) => ({
				...statObj,
				attack: statObj.attack + Math.floor(statObj.attack * 0.15) + 5
			}),

			Strength: (statObj) => ({
				...statObj,
				strength: statObj.strength + Math.floor(statObj.strength / 10) + 3
			}),

			"Super strength": (statObj) => ({
				...statObj,
				strength: statObj.strength + Math.floor(statObj.strength * 0.15) + 5
			}),

			"Zamorak brew": (statObj) => ({
				...statObj,
				attack: statObj.attack + Math.floor(statObj.attack / 5) + 2,
				strength: statObj.strength + Math.floor(statObj.strength * 0.12) + 2
			}),

			Ranging: (statObj) => ({
				...statObj,
				ranged: statObj.ranged + Math.floor(statObj.ranged / 10) + 4
			}),

			"Super ranging": (statObj) => ({
				...statObj,
				ranged: statObj.ranged + Math.floor(statObj.ranged * 0.15) + 5
			}),

			Magic: (statObj) => ({
				...statObj,
				magic: statObj.magic + 4
			}),

			"Super magic": (statObj) => ({
				...statObj,
				magic: statObj.magic + Math.floor(statObj.magic * 0.15) + 5
			}),

			"Imbued heart": (statObj) => ({
				...statObj,
				magic: statObj.magic + Math.floor(statObj.magic / 10) + 1
			}),

			"Super combat": (statObj) => {
				const boostObj = { ...statObj };
				for (const stat of ["attack", "strength", "defence"]) {
					boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.15) + 5;
				}
				return boostObj;
			},

			"Overload (+)": (statObj) => {
				const boostObj = { ...statObj };
				for (const stat of ["attack", "strength", "magic", "ranged", "defence"]) {
					boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.16) + 6;
				}
				return boostObj;
			},

			"Smelling salts": (statObj) => {
				const boostObj = { ...statObj };
				for (const stat of ["attack", "strength", "magic", "ranged", "defence"]) {
					boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.22) + 5;
				}
				return boostObj;
			}
		};
	}

	boostList () {
		return boosts;
	}

	consolidateBoosts (boostedStatsList) {
		const maxBoosts = {};
		for (const stat of stats) {
			for (const boostObj of boostedStatsList) {
				if (!(stat in maxBoosts) || boostObj[stat] > maxBoosts[stat]) {
					maxBoosts[stat] = boostObj[stat];
				}
			}
		}
		return maxBoosts;
	}

	boostStats (stats, boostList) {
		const boostedStatsList = boostList.map((boost) => this.potionEffects[boost](stats));
		boostedStatsList.push({ ...stats });
		return this.consolidateBoosts(boostedStatsList);
	}
}
