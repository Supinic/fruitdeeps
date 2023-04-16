import PropTypes from "prop-types";

import Player from "../../lib/Player.js";
import { MonsterProperty } from "./MonsterProperty.js";

export const StateProperty = PropTypes.shape({
	playerList: PropTypes.arrayOf(PropTypes.instanceOf(Player)),
	monster: MonsterProperty
});
