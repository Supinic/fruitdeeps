import PropTypes from "prop-types";

import { BonusesProperty } from "./BonusesProperty.js";
import { EquipmentSlotProperty } from "./EquipmentSlotProperty.js";
import leaguesData from "../../game-data/leagues4.json" assert { type: "json" };

const definition = {
	attackStyleSelected: PropTypes.number,
	boostList: PropTypes.arrayOf(PropTypes.string),
	customBonuses: BonusesProperty,
	equipment: PropTypes.objectOf(EquipmentSlotProperty),
	misc: PropTypes.shape({
		onTask: PropTypes.bool,
		wilderness: PropTypes.bool,
		currentHitpoints: PropTypes.number,
		kandarinHard: PropTypes.bool,
		charge: PropTypes.bool,
		baRank: PropTypes.number,
		manualSpeed: PropTypes.number,
		boltProcChanceList: PropTypes.objectOf(PropTypes.boolean),
		[leaguesData.playerMiscProperty]: PropTypes.string
	}),
	spell: PropTypes.string,
	prayerList: PropTypes.arrayOf(PropTypes.string),
	stats: PropTypes.shape({
		attack: PropTypes.number,
		strength: PropTypes.number,
		ranged: PropTypes.number,
		magic: PropTypes.number,
		hitpoints: PropTypes.number,
		prayer: PropTypes.number,
		defence: PropTypes.number,
		mining: PropTypes.number
	})
};

export const PlayerDataProperty = PropTypes.shape(definition);
