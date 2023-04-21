import PropTypes from "prop-types";
import { BonusesProperty } from "./BonusesProperty.js";

const genericEquipmentTypes = ["ammo", "body", "cape", "feet", "hands", "head", "legs", "neck", "ring", "shield"];

const GenericEquipmentProperty = PropTypes.shape({
	name: PropTypes.string,
	slot: PropTypes.oneOf(genericEquipmentTypes),
	bonuses: BonusesProperty
});

const WeaponEquipmentProperty = PropTypes.shape({
	name: PropTypes.string,
	slot: PropTypes.oneOf(["1h", "2h"]),
	bonuses: BonusesProperty,
	category: PropTypes.string,
	speed: PropTypes.number
});

export const EquipmentSlotProperty = PropTypes.oneOf([GenericEquipmentProperty, WeaponEquipmentProperty]);
