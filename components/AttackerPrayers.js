import React, { Component } from "react";
import PropTypes from "prop-types";

import { PrayerBook } from "../lib/PrayerBook.js";
import Player from "../lib/Player.js";

export class AttackerPrayers extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.handleTogglePrayer = this.handleTogglePrayer.bind(this);
		this.handleClearPrayer = this.handleClearPrayer.bind(this);
	}

	handleTogglePrayer (e) {
		const player = this.props.player;
		if (e.target.checked) {
			player.selectPrayer(e.target.value);
			this.props.setPlayer(player.minimize());
		}
		else {
			player.deselectPrayer(e.target.value);
			this.props.setPlayer(player.minimize());
		}
	}

	handleClearPrayer (e) {
		const player = this.props.player;
		e.persist();
		if (e.target.checked) {
			player.clearPrayers();
			this.props.setPlayer(player.minimize());
		}
	}

	render () {
		const result = {};
		const prayerList = new PrayerBook().prayerList();
		const prayerTypes = Object.keys(prayerList);

		for (const prayerType of prayerTypes) {
			const prayers = prayerList[prayerType];
			result[prayerType] = prayers.map((prayer, index) => (
				<div key={index}>
					<input
						type="checkbox"
						name={prayerType}
						id={`${prayerType}-${index}`}
						checked={this.props.player.prayers.includes(prayer)}
						onChange={this.handleTogglePrayer}
						value={prayer}
					/>
				</div>
			));
		}

		return (
			<div className="highlight-section flex-container-vertical">
				<div>
					<h3>Melee:</h3>
					{result.attack}
				</div>
				<div>
					{result.strength}
				</div>
				<div>
					{result.melee}
				</div>
				<div>
					<h3>Ranged:</h3>
					{result.ranged}
				</div>
				<div>
					<h3>Magic:</h3>
					{result.magic}
				</div>
				<div>
					<input
						type="checkbox"
						name="clear-prayers"
						id="clear-prayers"
						checked={this.props.player.prayers.length === 0}
						onChange={this.handleClearPrayer}
					/>
					<label htmlFor="clear-prayers">No Prayer</label>
				</div>
			</div>
		);
	}
}
