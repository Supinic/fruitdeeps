import PropTypes from "prop-types";

// @TODO fill this in
//
// 		Object.assign(this, attributes);
//
// 		this.equipment = {};
//
// 		for (const slot of slots) {
// 			if (slot !== "2h") {
// 				this.equipment[slot] = { ...nullItem, slot };
// 			}
// 		}
//
// 		this.equipment.weapon = unarmed;
//
// 		this.equipment = {
// 			...this.equipment, ...attributes.equipment
// 		};
//
// 		this.stats = {};
// 		for (const stat of stats) {
// 			this.stats[stat] = 99;
// 		}
//
// 		this.stats = {
// 			...this.stats, ...attributes.stats
// 		};
//
// 		this.misc = {
// 			onTask: true,
// 			wilderness: true,
// 			currentHitpoints: 99,
// 			kandarinHard: true,
// 			charge: false,
// 			tier3relic: null,
// 			tier6relic: false,
// 			mining: 99,
// 			baRank: 5,
// 			manualSpeed: 0,
// 			...attributes.misc
// 		};


const definition = {
	attackStyleSelected: PropTypes.number,
// 		boostList = [];
// 		prayers = [];
// 		equipment = {};
// 		spell: PropTypes.string;
// 		customBonuses = new Array(14).fill(0);
// 	stats: PropTypes.arrayOf(PropTypes.number),

// 			onTask: true,
// 			wilderness: true,
// 			currentHitpoints: 99,
// 			kandarinHard: true,
// 			charge: false,
// 			tier3relic: null,
// 			tier6relic: false,
// 			mining: 99,
// 			baRank: 5,
// 			manualSpeed: 0,
// 			...attributes.misc
};

export const PlayerDataProperty = PropTypes.shape(definition);
