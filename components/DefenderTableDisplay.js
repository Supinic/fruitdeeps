import React, { Component } from "react";
import PropTypes from "prop-types";
// import Image from "next/image";

import { MonsterProperty } from "./types/MonsterProperty.js";

const attributeList = [
	"dragon",
	"fiery",
	"spectral",
	"undead",
	"kalphite",
	"vampyre",
	"demon",
	"shade",
	"leafy",
	"penance",
	"xerician"
];

const MonsterStat = (props) => (
	<input
		type="number"
		className="input-invisible"
		min="1"
		value={props.value}
		data-stat={props.stat}
		onChange={props.onChange}
	/>
);

MonsterStat.propTypes = {
	value: PropTypes.number,
	stat: PropTypes.string,
	onChange: PropTypes.func
};

const MonsterBonus = (props) => {
	let colourClassName = "color-grey";
	if (props.value > 0) {
		colourClassName = "color-3";
	}
	else if (props.value < 0) {
		colourClassName = "color-1";
	}

	return (
		<td className={colourClassName}>
			<input
				type="number"
				className="input-invisible align-right"
				min="0"
				value={props.value}
				data-stat={props.stat} onChange={props.onChange}/>
		</td>
	);
};

MonsterBonus.propTypes = {
	value: PropTypes.number,
	stat: PropTypes.string,
	onChange: PropTypes.func
};

export class DefenderTableDisplay extends Component {
	static propTypes = {
		monster: MonsterProperty,
		setMonster: PropTypes.func,
		setMonsterStat: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.changeInvocation = this.changeInvocation.bind(this);
		this.toggleAttribute = this.toggleAttribute.bind(this);
	}

	handleChange (e) {
		e.persist();
		const stat = e.target.getAttribute("data-stat");
		const value = e.target.value;
		this.props.setMonsterStat(stat, value);
	}

	changeInvocation (e) {
		e.persist();
		const value = parseInt(e.target.value) || 0;
		const newMonster = JSON.parse(JSON.stringify(this.props.monster));
		newMonster.invocation = value;
		this.props.setMonster(newMonster);
	}

	toggleAttribute (e) {
		e.persist();
		const attribute = e.target.value;
		const monster = this.props.monster;
		let newMonster = {};
		newMonster = Object.assign(newMonster, monster);

		if (newMonster.attributes.includes(attribute)) {
			newMonster.attributes = newMonster.attributes.filter(e => e !== attribute);
		}
		else {
			newMonster.attributes.push(attribute);
		}
		console.log(newMonster.attributes, attribute);
		this.props.setMonster(newMonster);
	}

	render () {
		const attributeButtons = attributeList.map((attribute, index) => (
			<button
				key={index}
				value={attribute}
				onClick={this.toggleAttribute}
				className={(this.props.monster.attributes.includes(attribute)) ? "selected" : ""}
			>
				{attribute}
			</button>
		));

		let invocationSection;
		if (typeof this.props.monster.invocation === "number") {
			invocationSection = (
				<div>
					<h3>Invocation</h3>
					<div className="flex-valign">
						<input
							type="number"
							min="0"
							max="600"
							value={this.props.monster.invocation}
							step="5"
							id="invocationInput"
							onChange={this.changeInvocation}
							className="input-invisible"
						/>
						<input
							type="range"
							min="0"
							max="600"
							value={this.props.monster.invocation}
							step="5"
							id="invocationSlider"
							className="slider"
							onChange={this.changeInvocation}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className="flex-container-vertical">
				<div>
					<h3>Stats</h3>
					<table className="stats-table">
						<tbody>
							<tr>
								<td>
									<div className="stat-wrap">
										<img alt="combat" src="/assets/svg/combat_icon.svg"/>
										{this.props.monster.combat}
									</div>
								</td>
								<td>
									<div className="stat-wrap">
										<img alt="hitpoints" src="/assets/svg/hitpoints_icon.svg"/>

										<MonsterStat
											value={this.props.monster.stats.hitpoints}
											stat="hitpoints"
											onChange={this.handleChange}
										/>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="stat-wrap">
										<img alt="defence" src="/assets/svg/defence_icon.svg"/>
										<MonsterStat
											value={this.props.monster.stats.def}
											stat="def"
											onChange={this.handleChange}
										/>
									</div>
								</td>
								<td>
									<div className="stat-wrap">
										<img alt="magic" src="/assets/svg/magic_icon.svg"/>
										<MonsterStat
											value={this.props.monster.stats.mage}
											stat="mage"
											onChange={this.handleChange}
										/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<h3>Attack Bonus</h3>
					<table className="bonus-table">
						<tbody>
							<tr>
								<td>
								Magic
								</td>
								<MonsterBonus
									value={this.props.monster.stats.amagic}
									stat="amagic"
									onChange={this.handleChange}
								/>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<h3>Defence bonus</h3>
					<table className="bonus-table">
						<tbody>
							<tr>
								<td>Stab</td>
								<MonsterBonus
									value={this.props.monster.stats.dstab}
									stat="dstab"
									onChange={this.handleChange}
								/>
							</tr>
							<tr>
								<td>Slash</td>
								<MonsterBonus
									value={this.props.monster.stats.dslash}
									stat="dslash"
									onChange={this.handleChange}
								/>
							</tr>
							<tr>
								<td>Crush</td>
								<MonsterBonus
									value={this.props.monster.stats.dcrush}
									stat="dcrush"
									onChange={this.handleChange}
								/>
							</tr>
							<tr>
								<td>Magic</td>
								<MonsterBonus
									value={this.props.monster.stats.dmagic}
									stat="dmagic"
									onChange={this.handleChange}
								/>
							</tr>
							<tr>
								<td>Range</td>
								<MonsterBonus
									value={this.props.monster.stats.drange}
									stat="drange"
									onChange={this.handleChange}
								/>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<h3>Attributes</h3>
					{attributeButtons}
				</div>
				{invocationSection}
			</div>
		);
	}
}
