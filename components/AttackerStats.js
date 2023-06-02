import React, { Component } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";
import { list as boostList } from "../lib/Boosts.js";
// import Image from "next/image";

class StatPicker extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		stat: PropTypes.string,
		imgSrc: PropTypes.string
	};

	render () {
		const player = this.props.player;
		return (<td>
			<div className="stat-wrap">
				<img alt={this.props.stat} style={{ width: "1em" }} src={this.props.imgSrc}/>
				<span>{this.props.player.boostedStats[this.props.stat]}/</span>
				<input
					className="input-invisible"
					type="number"
					min="0"
					max="99"
					value={this.props.player.stats[this.props.stat]}
					onChange={(e) => {
						player.setStat(this.props.stat, e.target.value);
						this.props.setPlayer(player.minimize());
					}}
				/>
			</div>
		</td>);
	}
}

class HpPicker extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		imgSrc: PropTypes.string
	};

	setMisc (attribute, value) {
		const player = this.props.player;
		player.setMisc(attribute, value);
		this.props.setPlayer(player.minimize());
	}

	render () {
		const player = this.props.player;
		return (<td colSpan="2">
			<div className="stat-wrap">
				<img alt="" style={{ width: "1em" }} src={this.props.imgSrc}/>
				<input
					className="input-invisible"
					type="number"
					min="0"
					max="99"
					value={this.props.player.misc.currentHitpoints}
					onChange={(e) => {
						this.setMisc("currentHitpoints", e.target.value);
					}}
				/>
				<pre> / </pre>
				<input
					className="input-invisible"
					type="number"
					min="10"
					max="99"
					value={this.props.player.stats.hitpoints}
					onChange={(e) => {
						player.setStat("hitpoints", e.target.value);
						this.props.setPlayer(player.minimize());
					}}
				/>
			</div>
		</td>);
	}
}

export class AttackerStats extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		bonusList: PropTypes.arrayOf(PropTypes.string)
	};

	constructor (props) {
		super(props);
		this.checkboxChange = this.checkboxChange.bind(this);
		this.checkList = props.bonusList;
		this.boostClick = this.boostClick.bind(this);
	}

	checkboxChange (e) {
		const player = this.props.player;
		if (e.target.checked) {
			player.addBoost(e.target.value);
		}
		else {
			player.removeBoost(e.target.value);
		}

		this.props.setPlayer(player.minimize());
	}

	boostClick (e) {
		const player = this.props.player;
		if (this.props.player.boostList.includes(e.target.value)) {
			player.removeBoost(e.target.value);
		}
		else {
			player.addBoost(e.target.value);
		}
		this.props.setPlayer(player.minimize());
	}

	render () {
		const potionInput = boostList.map((boost, i) => (
			<button
				key={i}
				value={boost}
				onClick={this.boostClick}
				className={this.props.player.boostList.includes(boost) ? "selected" : ""}
			>
				{boost}
			</button>
		));

		return (<div className="highlight-section flex-container-vertical">
			<table className="stats-table">
				<tbody>
					<tr>
						<StatPicker
							stat="attack"
							imgSrc="/assets/svg/attack_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
						<StatPicker
							stat="strength"
							imgSrc="/assets/svg/strength_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
					</tr>
					<tr>
						<StatPicker
							stat="defence"
							imgSrc="/assets/svg/defence_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
						<StatPicker
							stat="ranged"
							imgSrc="/assets/svg/ranged_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
					</tr>
					<tr>
						<StatPicker
							stat="prayer"
							imgSrc="/assets/svg/prayer_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
						<StatPicker
							stat="magic"
							imgSrc="/assets/svg/magic_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
					</tr>
					<tr>
						<HpPicker
							imgSrc="/assets/svg/hitpoints_icon.svg"
							player={this.props.player}
							setPlayer={this.props.setPlayer}
						/>
					</tr>
					<tr className="center">
						<td>Current</td>
						<td>Base</td>
					</tr>
				</tbody>
			</table>
			<div className="center stat-wrap">
				<img alt="Combat" src="/assets/svg/combat_icon.svg"/>
				{this.props.player.combat}
			</div>
			<div>
				<h3>Boosts:</h3>
				<div>
					{potionInput.slice(0, 5)}
				</div>
				<div>
					{potionInput.slice(5, 7)}
				</div>
				<div>
					{potionInput.slice(7, 11)}
				</div>
				<div>
					{potionInput.slice(11)}
				</div>
			</div>
		</div>);
	}
}
