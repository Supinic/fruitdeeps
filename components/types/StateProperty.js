import PropTypes from "prop-types";

import { MonsterProperty } from "./MonsterProperty.js";
import { PlayerDataProperty } from "./PlayerDataProperty.js";

export const StateProperty = PropTypes.shape({
	playerList: PropTypes.arrayOf(PlayerDataProperty),
	monster: MonsterProperty
});
