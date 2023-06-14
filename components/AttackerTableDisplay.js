import React, { Component, useState } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";

const BonusSelectRow = (props) => {
	const customBonus = props.player.customBonuses[props.bonusIndex];
	let asterisk = null;
	if (customBonus !== 0) {
		asterisk = (
			<span
				className={customBonus < 0 ? "color-2" : "color-3"}
				title="Custom additive modifier active"
			>
                *
			</span>
		);
	}

	let colorClass = "color-grey";
	if (props.player.bonuses[props.bonusIndex] > 0) {
		colorClass = "color-3";
	}
	else if (props.player.bonuses[props.bonusIndex] < 0) {
		colorClass = "color-2";
	}

	let percent = <pre className="hidden"> %</pre>;
	if (props.percent) {
		percent = <pre> %</pre>;
	}

	return (
		<tr>
			<td className="single-line">
				{props.bonusName}
				{asterisk}
			</td>
			<td className={colorClass}>
				<span className="stat-wrap">
					<input
						type="number"
						onChange={props.onChange}
						value={props.player.bonuses[props.bonusIndex]}
						data-bonus={props.bonusIndex}
						className="input-invisible align-right"
					/>
					{percent}
				</span>
			</td>
		</tr>
	);
};

BonusSelectRow.propTypes = {
	player: PropTypes.instanceOf(Player),
	percent: PropTypes.bool,
	bonusName: PropTypes.string,
	bonusIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	onChange: PropTypes.func
};

const BonusSwitcher = (props) => {
	const [type, setType] = useState("atk");

	return <div>
		<button className={type === "atk" ? "selected" : ""} onClick={() => setType("atk")}>Attack bonus</button>
		{" "}
		<button className={type === "def" ? "selected" : ""}

			onClick={() => setType("def")}>Defence bonus
		</button>
		<table className="bonus-table">
			<tbody>
				<BonusSelectRow
					onChange={props.handleSetBonus}
					bonusName="Stab"
					bonusIndex={type === "atk" ? 0 : 5}
					player={props.player}
				/>
				<BonusSelectRow
					onChange={props.handleSetBonus}
					bonusName="Slash"
					bonusIndex={type === "atk" ? 1 : 6}
					player={props.player}
				/>
				<BonusSelectRow
					onChange={props.handleSetBonus}
					bonusName="Crush"
					bonusIndex={type === "atk" ? 2 : 7}
					player={props.player}
				/>
				<BonusSelectRow
					onChange={props.handleSetBonus}
					bonusName="Magic"
					bonusIndex={type === "atk" ? 3 : 8}
					player={props.player}
				/>
				<BonusSelectRow
					onChange={props.handleSetBonus}
					bonusName="Range"
					bonusIndex={type === "atk" ? 4 : 9}
					player={props.player}
				/>
			</tbody>
		</table>
	</div>;
};

BonusSwitcher.propTypes = {
	player: PropTypes.instanceOf(Player),
	handleSetBonus: PropTypes.func
};

export class AttackerTableDisplay extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.handleSetBonus = this.handleSetBonus.bind(this);
		this.handleClearBonus = this.handleClearBonus.bind(this);
		this.handleSetSpeed = this.handleSetSpeed.bind(this);
	}

	handleSetSpeed (e) {
		e.persist();
		const player = this.props.player;
		let newSpeed = parseFloat(e.target.value);
		if (newSpeed <= 0) {
			newSpeed = 0;
		}
		player.setMisc("manualSpeed", newSpeed);
		this.props.setPlayer(player.minimize());
	}

	handleSetBonus (e) {
		e.persist();

		const player = this.props.player;
		player.setBonusCustom(parseInt(e.target.getAttribute("data-bonus")), parseInt(e.target.value));
		this.props.setPlayer(player.minimize());
	}

	handleClearBonus () {
		const player = this.props.player;
		player.clearCustomBonuses();
		player.setMisc("manualSpeed", 0);
		this.props.setPlayer(player.minimize());
	}

	render () {
		const player = this.props.player;
		let customSum = 0;
		for (let i = 0; i < this.props.player.customBonuses.length; i++) {
			customSum += Math.abs(this.props.player.customBonuses[i]);
		}

		let clearButton = null;
		if (customSum > 0 || player.misc.manualSpeed > 0) {
			clearButton = (<div>
				<button onClick={this.handleClearBonus}>
						Clear custom bonuses
				</button>
			</div>);
		}

		return (
			<div className="flex-child flex-container-vertical">
				<BonusSwitcher handleSetBonus={this.handleSetBonus} player={player}/>
				<div>
					<h3>Other bonuses</h3>
					<table className="bonus-table">
						<tbody>
							<BonusSelectRow
								onChange={this.handleSetBonus}
								bonusName="Melee Strength"
								bonusIndex="10"
								player={player}
							/>
							<BonusSelectRow
								onChange={this.handleSetBonus}
								bonusName="Ranged Strength"
								bonusIndex="11"
								player={player}
							/>
							<BonusSelectRow
								onChange={this.handleSetBonus}
								bonusName="Magic Damage"
								bonusIndex="12"
								player={player}
								percent={true}
							/>
							<BonusSelectRow
								onChange={this.handleSetBonus}
								bonusName="Prayer"
								bonusIndex="13"
								player={player}
							/>
						</tbody>
					</table>
				</div>
				<div>
					<h3>Weapon</h3>
					<table className="bonus-table">
						<tbody>
							<tr>
								<td>Category</td>
								<td className="color-grey">
									{player.equipment.weapon.category}
								</td>
							</tr>
							<tr>
								<td>Base speed</td>
								<td className="color-grey">
									{player.equipment.weapon.speed}
								</td>
							</tr>
							<tr>
								<td className="single-line">
								Manual speed
									{player.misc.manualSpeed > 0 ? (<span className="color-grey">*</span>) : ("")}
								</td>
								<td
									className="color-grey"
									onChange={this.handleSetSpeed}
								>
									<input
										readOnly
										type="number"
										value={player.misc.manualSpeed}
										className="input-invisible align-right"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{clearButton}
			</div>
		);
	}
}
