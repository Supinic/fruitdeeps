import { calculateDpsPerDefenceList } from "../Dps.js";

const DEFENCE_STEP = 5;
const DRAGON_WARHAMMER_SPECS = 3;

/**
 * Calculates the defence reduction points for a given defence value.
 * @param {number} defence
 * @returns {{dwh: Set<number>, vuln: number}}
 */
export function getDefenceReductionPoints (defence) {
	// Add several defence points for consecutive DWH special attacks
	let warhammerDef = defence;
	const dwh = new Set();
	for (let i = 0; i < DRAGON_WARHAMMER_SPECS; i++) {
		warhammerDef -= Math.trunc(warhammerDef * 0.3);

		// Do not add a point if it is identical to the base value.
		if (warhammerDef !== defence) {
			dwh.add(warhammerDef);
		}
	}

	// Add a defence point for Vulnerability
	const vuln = defence - Math.trunc(defence / 10) - 1;
	return {
		dwh,
		vuln
	};
}

/**
 * @param {Player[]} playerList
 * @param {Dps[]} dpsList
 * @param {Object} monster
 * @returns {{ graphData: *[] }}
 */
export function createDamageDefenceGraphData (playerList, dpsList, monster) {
	const graphData = [];
	const baseDefence = monster.stats.def ?? 0;
	const graphObject = { defence: baseDefence };

	// Initialize defence points with the monster's base defence
	for (let i = 0; i < dpsList.length; i++) {
		const dpsObject = dpsList[i];
		graphObject[`Set ${i + 1}`] = Number(dpsObject.dps.toFixed(3));
	}
	graphData.push(graphObject);

	// Create the base defence points list the DPS will be recalculated for.
	// Begin by selecting the closest multiple of DEFENCE_STEP - begin from there, and iterate towards zero.
	const defSet = new Set();
	const startingDefence = Math.trunc(baseDefence / DEFENCE_STEP) * DEFENCE_STEP;
	for (let i = startingDefence; i >= 0; i -= DEFENCE_STEP) {
		defSet.add(i);
	}

	const reductionPoints = getDefenceReductionPoints(baseDefence);
	defSet.add(reductionPoints.vuln);
	for (const value of reductionPoints.dwh) {
		defSet.add(value);
	}

	const playerDpsValues = [];
	for (const playerData of playerList) {
		const dpsValues = calculateDpsPerDefenceList(playerData, monster, defSet);
		playerDpsValues.push(dpsValues);
	}

	const sortedDefencePoints = Array.from(defSet).sort((a, b) => b - a);
	for (const defence of sortedDefencePoints) {
		const graphObject = { defence };
		for (let i = 0; i < playerList.length; i++) {
			const dps = playerDpsValues[i].get(defence);
			graphObject[`Set ${i + 1}`] = Number(dps.toFixed(3));
		}

		graphData.push(graphObject);
	}

	return { graphData };
}
