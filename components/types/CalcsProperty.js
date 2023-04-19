import PropTypes from "prop-types";

const definition = {
	vertex: PropTypes.oneOf(["Melee", "Ranged", "Magic"]),
	flags: PropTypes.arrayOf(PropTypes.string),
	maxHit: PropTypes.number,
	accuracy: PropTypes.number,
	attackSpeed: PropTypes.number,
	dps: PropTypes.number,
	acc1plus: PropTypes.number,
	overhit1: PropTypes.number,
	overhit2: PropTypes.number,
	hitpoints: PropTypes.number,
	specName: PropTypes.string,
	eHealing: PropTypes.number,
	ePrayer: PropTypes.number,
	eDefReduction: PropTypes.number,
	specCalcs: PropTypes.shape({
		vertex: PropTypes.oneOf(["Melee", "Ranged", "Magic"]),
		flags: PropTypes.arrayOf(PropTypes.string),
		maxHitSpec: PropTypes.number,
		specAcc: PropTypes.number,
		attackSpeed: PropTypes.number,
		dps: PropTypes.number,
		acc1plus: PropTypes.number,
		overhit1: PropTypes.number,
		overhit2: PropTypes.number,
		hitpoints: PropTypes.number,
		specName: PropTypes.string,
		eHealing: PropTypes.number,
		ePrayer: PropTypes.number,
		eDefReduction: PropTypes.number
	})
};

export const CalcsProperty = PropTypes.shape(definition);
