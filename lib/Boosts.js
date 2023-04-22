const { boosts } = require("../game-data/boosts.json");

const calculateBoost = (stats, boostData) => {
	const boostedStats = {};
	for (const [affectedStat, boostValue] of Object.entries(boostData.effects)) {
		const { multiplier = 1, flat = 0 } = boostValue;
		boostedStats[affectedStat] = Math.floor(stats[affectedStat] * multiplier) + flat;
	}

	return boostedStats;
};

/**
 * Accepts a stat object and list of boosts, and returns an object representing the boosted stats.
 * @param {Object} stats
 * @param {string[]|Set<string>} appliedBoostNames
 * @returns {Object}
 */
export function apply (stats, appliedBoostNames) {
	const result = { ...stats };

	for (const boostName of appliedBoostNames) {
		const boostData = boosts.find(i => i.name === boostName);
		if (!boostData) {
			console.warn("Invalid boost found", boostName);
			continue;
		}

		const boostedStats = calculateBoost(stats, boostData);
		for (const [stat, value] of Object.entries(boostedStats)) {
			if (value > result[stat]) {
				result[stat] = value;
			}
		}
	}

	return result;
}

/**
 * @type {string[]}
 */
export const list = boosts.map(i => i.name);
