import React, { Component } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";
import items from "../public/assets/items.json" assert { type: "json" };
import { presets } from "./builtin-presets.js";
import searchFilter from "../lib/itemFinder.js";

for (const item of presets) {
	if (!item.equipmentIdentifiers) {
		continue;
	}

	item.equipment = item.equipmentIdentifiers.map(i => {
		const [result] = searchFilter(i, items);
		if (!result) {
			throw new Error(`No item found: ${i}`);
		}

		return result;
	});
}

export class AttackerPresets extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func,
		setTab: PropTypes.func
	};

	constructor (props) {
		super(props);

		this.elements = presets.map((i, ind) => {
			if (i.separator) {
				return (
					<br key={ind} />
				);
			}

			return (
				<button key={ind} onClick={() => this.changeSetup(ind)}>{i.name}</button>
			);
		});
	}

	changeSetup (index) {
		const player = this.props.player;
		const preset = presets[index];
		if (preset.name === "Clear") {
			player.clearEquipment();
			player.clearPrayers();
			player.clearBoosts();
			player.clearCustomBonuses();
		}

		if (Array.isArray(preset.equipment)) {
			player.clearEquipment();
			for (const item of preset.equipment) {
				player.equip(item);
			}
		}

		if (Array.isArray(preset.prayers)) {
			player.clearPrayers();
			for (const prayer of preset.prayers) {
				player.selectPrayer(prayer);
			}
		}

		if (Array.isArray(preset.boosts)) {
			player.clearBoosts();
			for (const boost of preset.boosts) {
				player.addBoost(boost);
			}
		}

		this.props.setPlayer(player.minimize());
		this.props.setTab(0);
	}

	render () {
		return (
			<div className="highlight-section flex-container-vertical">
				<h3>Apply setup preset</h3>
				{...this.elements}
			</div>
		);
	}
}
