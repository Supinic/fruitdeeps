import React, { Component } from "react";
import PropTypes from "prop-types";

import { CalcsProperty } from "./types/CalcsProperty.js";
import { StateProperty } from "./types/StateProperty.js";
import { isApplied as areRubyBoltsApplied } from "../lib/dps/modifiers/bolts/ruby.js";

function hpLimit (dmg, hp) {
	if (dmg <= hp) {
		return dmg;
	}
	else {
		return <span>{hp}<span className="sub-text"> {`(${dmg})`}</span></span>;
	}
}

function secondsToHms (d) {
	d = Number(d);
	const h = Math.floor(d / 3600);
	const m = Math.floor(d % 3600 / 60);
	const s = (d % 3600 % 60).toFixed(1);

	const hDisplay = h > 0 ? `${h}h ` : "";
	const mDisplay = m > 0 ? `${m}m ` : "";
	const sDisplay = s > 0 ? `${s}s` : "";
	return hDisplay + mDisplay + sDisplay;
}

const decimals = 3;

class OutputTable extends Component {
	static propTypes = {
		name: PropTypes.string,
		rows: PropTypes.arrayOf(PropTypes.element)
	};

	render () {
		return (
			<div>
				<span className="color-grey">{this.props.name}</span>
				<table className="bonus-table">
					<tbody>
						{this.props.rows}
					</tbody>
				</table>
			</div>
		);
	}
}

export class CalcOutputNumbers extends Component {
	static propTypes = {
		calcs: CalcsProperty,
		ttk: PropTypes.number,
		spec: PropTypes.bool,
		dpsState: StateProperty
	};

	constructor (props) {
		super(props);

		this.attack = this.attack.bind(this);
		this.damage = this.damage.bind(this);
		this.accuracy = this.accuracy.bind(this);
		this.special = this.special.bind(this);
		this.dps = this.dps.bind(this);
	}

	attack () {
		const vertex = this.props.calcs.vertex;
		let color = "";
		switch (vertex) {
			case "Magic":
				color = "color-1";
				break;
			case "Ranged":
				color = "color-3";
				break;
			case "Melee":
				color = "color-2";
				break;
		}

		const rows = [
			<tr key="attack-type">
				<td>Type</td>
				<td className={color}>{this.props.calcs.attackType}</td>
			</tr>,
			<tr key="attack-style">
				<td>Style</td>
				<td>{this.props.calcs.attackStyle}</td>
			</tr>,
			<tr key={"attack-speed"}>
				<td>Speed</td>
				<td>{this.props.calcs.attackSpeed}</td>
			</tr>
		];

		return <OutputTable name="Attack" rows={rows}/>;
	}

	damage () {
		const rows = [];
		const hp = this.props.calcs.npcHp;

		rows.push(
			<tr key="max-hit">
				<td>Max hit</td>
				<td>{hpLimit(this.props.calcs.maxHit, hp)}</td>
			</tr>
		);

		// For multi-hit weapons
		if (this.props.calcs.maxList.length > 1) {
			for (let i = 0; i < this.props.calcs.maxList.length; i++) {
				rows.push(
					<tr key="max-list">
						<td>Max hit <span className="sub-text">(hit {i + 1})</span></td>
						<td>{hpLimit(this.props.calcs.maxList[i], hp)}</td>
					</tr>
				);
			}
		}

		if (typeof this.props.calcs.maxHitSpec === "number") {
			rows.push(
				<tr key="max-hit-spec">
					<td>Max hit <span className="sub-text">(proc)</span></td>
					<td>{hpLimit(this.props.calcs.maxHitSpec, hp)}</td>
				</tr>
			);
		}

		rows.push(
			<tr key="expected-damage">
				<td>Expected</td>
				<td>{this.props.calcs.eDmg.toFixed(2)}</td>
			</tr>
		);

		return <OutputTable name="Damage" rows={rows}/>;
	}

	accuracy () {
		const rows = [];
		rows.push(
			<tr key="raw-accuracy">
				<td>Raw</td>
				<td>{`${(this.props.calcs.rawAcc * 100).toFixed(decimals - 1)}%`}</td>
			</tr>
		);

		if (typeof this.props.calcs.specAcc === "number") {
			rows.push(
				<tr key="proc-accuracy">
					<td><span className="sub-text">(with proc)</span></td>
					<td>{`${(this.props.calcs.specAcc * 100).toFixed(decimals - 1)}%`}</td>
				</tr>
			);
		}

		rows.push(
			<tr key="nonzero-accuracy">
				<td>p(dmg {">"} 0)</td>
				<td className="color-1">{`${(this.props.calcs.acc1plus * 100).toFixed(decimals - 1)}%`}</td>
			</tr>
		);

		return <OutputTable name="Accuracy" rows={rows}/>;
	}

	dps () {
		const rows = [];
		const momentary = (<span className="sub-text">(momentary)</span>);
		const hp = this.props.calcs.hitpoints;

		const contTtk = this.props.ttk;
		const ttk = this.props.ttk - this.props.calcs.attackSpeed;

		const overhitDps = hp / ttk / 0.6;
		const overhitCont = hp / contTtk / 0.6;

		const rubyBoltsApplied = areRubyBoltsApplied(this.props.calcs, this.props.dpsState.player);
		rows.push(
			<tr key="raw-dps">
				<td>Raw {(rubyBoltsApplied) ? momentary : null}</td>
				<td>{this.props.calcs.dps.toFixed(decimals)}</td>
			</tr>
		);

		if (!this.props.spec) {
			rows.push(
				<tr key="overhit-dps">
					<td>Overhit</td>
					<td className="color-1">{this.props.ttk !== null ? overhitDps.toFixed(decimals) : "..."}</td>
				</tr>,
				<tr key="overhit-cont-dps">
					<td>Overhit <span className="sub-text">(cont.)</span></td>
					<td className="color-1">{this.props.ttk !== null ? overhitCont.toFixed(decimals) : "..."}</td>
				</tr>
			);
		}

		return <OutputTable name="Dps" rows={rows}/>;
	}

	ttk () {
		const ttk = this.props.ttk - this.props.calcs.attackSpeed;
		const rows = [];

		rows.push(
			<tr key="seconds">
				<td>Seconds</td>
				<td>{
					(this.props.ttk !== null)
						? (
							<span>{secondsToHms(ttk * 0.6)}
								<span className="sub-text">
								(+{secondsToHms(this.props.calcs.attackSpeed * 0.6)})
								</span>
							</span>
						)
						: "..."
				}
				</td>
			</tr>,
			<tr key="ticks">
				<td>Ticks</td>
				<td className="color-1">
					{
						(this.props.ttk !== null)
							? (
								<span>{ttk.toFixed(2)}
									<span className="sub-text">
										(+{this.props.calcs.attackSpeed})
									</span>
								</span>
							)
							: "..."
					}
				</td>
			</tr>
		);

		return <OutputTable name="Time to kill" rows={rows}/>;
	}

	special () {
		const calcs = this.props.calcs;
		if (!(calcs.eHealing > 0 || calcs.eDefReduction > 0 || calcs.ePrayer > 0)) {
			return null;
		}

		return (<div>
			<span className="color-grey">Special</span>
			<table className="bonus-table">
				<tbody>
					{calcs.eHealing > 0 && <tr>
						<td>Expected healing</td>
						<td>{calcs.eHealing.toFixed(3)}</td>
					</tr>}
					{(calcs.ePrayer > 0) && <tr>
						<td>Expected prayer regeneration</td>
						<td>{calcs.ePrayer.toFixed(3)}</td>
					</tr>}
					{(calcs.eDefReduction > 0) && <tr>
						<td>Expected def reduction</td>
						<td>{calcs.eDefReduction.toFixed(3)}</td>
					</tr>}
				</tbody>
			</table>
		</div>);
	}

	render () {
		return (<div className="flex-container flex-child">
			<div className="flex-child flex-container-vertical">
				{this.attack()}
				{this.damage()}
				{this.accuracy()}
			</div>
			<div className="flex-child">
				<div className="highlight-section flex-container-vertical">
					{this.dps()}
					{this.props.spec || this.ttk()}
					{this.special()}
				</div>
			</div>
		</div>);
	}
}
