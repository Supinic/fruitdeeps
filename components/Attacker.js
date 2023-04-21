import React, { Component } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";

import { AttackerTableDisplay } from "./AttackerTableDisplay.js";
import { AttackerTabs } from "./AttackerTabs.js";
import { AttackerAttackStyles } from "./AttackerAttackStyles.js";

export class Attacker extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func
	};

	render () {
		const player = this.props.player;
		return (
			<div className="flex-container">
				<div className="flex-child flex-container-vertical">
					<AttackerTabs player={player} setPlayer={this.props.setPlayer} />
					<AttackerAttackStyles player={player} setPlayer={this.props.setPlayer} />
				</div>
				<AttackerTableDisplay player={player} setPlayer={this.props.setPlayer} />
			</div>
		);
	}
}
