import React, { Component } from "react";
import PropTypes from "prop-types";

import { AttackerMisc } from "./AttackerMisc.js";
import Player from "../lib/Player.js";
import leaguesData from "../game-data/leagues4.json" assert { type: "json" };

const { combatRelics, playerMiscProperty } = leaguesData;

const League4CombatRelic = (props) => (<div>
	<input
		type="checkbox"
		id={`${props.relicId}-select`}
		checked={props.player.misc[playerMiscProperty] === props.relicId}
		value={props.relicId}
		onChange={props.setRelic}
	/>
	<label htmlFor={`${props.relicId}-select`}>{combatRelics[props.relicId]}</label>
</div>);

League4CombatRelic.propTypes = {
	player: PropTypes.instanceOf(Player),
	relicId: PropTypes.string,
	setRelic: PropTypes.func
};

export class AttackerRelics extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		slotname: PropTypes.string
	};

	constructor (props) {
		super(props);
		this.importRef = React.createRef();

		this.setLeagues4CombatRelic = this.setLeagues4CombatRelic.bind(this);
	}

	setMisc (attribute, value) {
		const player = this.props.player;
		player.setMisc(attribute, value);
		this.props.setPlayer(player.minimize());
	}

	setLeagues4CombatRelic (e) {
		if (e.target.checked) {
			this.setMisc(playerMiscProperty, e.target.value);
		}
		else {
			this.setMisc(playerMiscProperty, null);
		}
	}

	render () {
		return (<div className="highlight-section flex-container-vertical">
			<AttackerMisc player={this.props.player} setMisc={this.setMisc.bind(this)}/>
			<div>
				<h3>Leagues 4 relics</h3>
				<div>
					<League4CombatRelic player={this.props.player} relicId="Magic" setRelic={this.setLeagues4CombatRelic}/>
					<League4CombatRelic player={this.props.player} relicId="Melee" setRelic={this.setLeagues4CombatRelic}/>
					<League4CombatRelic player={this.props.player} relicId="Ranged" setRelic={this.setLeagues4CombatRelic}/>
				</div>
			</div>
		</div>);
	}
}
