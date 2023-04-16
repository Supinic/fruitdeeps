import PropTypes from "prop-types";

export const MonsterProperty = PropTypes.shape({
	name: PropTypes.string,
	image: PropTypes.string,
	version: PropTypes.string,
	versionNumber: PropTypes.number,
	combat: PropTypes.number,
	invocation: PropTypes.number,
	stats: PropTypes.shape({
		amagic: PropTypes.number,
		arange: PropTypes.number,
		att: PropTypes.number,
		attbns: PropTypes.number,
		dcrush: PropTypes.number,
		def: PropTypes.number,
		dmagic: PropTypes.number,
		drange: PropTypes.number,
		dslash: PropTypes.number,
		dstab: PropTypes.number,
		hitpoints: PropTypes.number,
		mage: PropTypes.number,
		mbns: PropTypes.number,
		range: PropTypes.number,
		rngbns: PropTypes.number,
		str: PropTypes.number,
		strbns: PropTypes.number
	}),
	attributes: PropTypes.arrayOf(PropTypes.string)
});
