import * as diamond from "./diamond.js";
import * as dragonstone from "./dragonstone.js";
import * as jade from "./jade.js";
import * as onyx from "./onyx.js";
import * as opal from "./opal.js";
import * as pearl from "./pearl.js";
import * as ruby from "./ruby.js";

const boltTypeList = [diamond, dragonstone, jade, onyx, opal, pearl, ruby];
const findAppliedBolt = (dps, player, monster) => {
	for (const boltType of boltTypeList) {
		if (boltType.isApplied(dps, player, monster)) {
			return boltType;
		}
	}

	return null;
};

export function applyModifier (dps, player, monster) {
	const boltType = findAppliedBolt(dps, player, monster);
	return boltType.applyModifier(dps, player, monster);
}

export function isApplied (dps, player, monster) {
	return Boolean(findAppliedBolt(dps, player, monster));
}
