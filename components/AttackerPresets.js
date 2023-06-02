import React, { Component } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";
import { PresetDropdown } from "./PresetDropdown.js";

export class AttackerPresets extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		setTab: PropTypes.func
	};

	render () {
		return (
			<div className="highlight-section flex-container-vertical">
				<h3>Apply setup preset</h3>
				<PresetDropdown player={this.props.player} setTab={this.props.setTab} setPlayer={this.props.setPlayer} />
			</div>
		);
	}
}
