import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import {
	BarChart,
	Bar,
	// Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	// Legend,
	ResponsiveContainer
	// ReferenceLine,
	// Label
} from "recharts";

import { CalcsProperty } from "./types/CalcsProperty.js";
import { CalcOutputNumbers } from "./CalcOutputNumbers.js";
import { descriptions as flagDescriptions } from "../game-data/flags.json";

const toPercent = (decimal, fixed = 2) => `${(decimal * 100).toFixed(fixed)}%`;

export class CalcOutput extends Component {
	static propTypes = {
		calcs: CalcsProperty,
		ttk: PropTypes.number
	};

	constructor (props) {
		super(props);
		this.state = {
			expand: false,
			spec: false
		};
		this.toggleExpand = this.toggleExpand.bind(this);
	}

	toggleExpand () {
		if (this.state.expand) {
			this.setState({ expand: false });
		}
		else {
			this.setState({ expand: true });
		}
	}

	render () {
		const specMode = this.state.spec && this.props.calcs.specCalcs !== null;
		const calcs = specMode ? this.props.calcs.specCalcs : this.props.calcs;
		const hitDist = calcs.hitDist;
		const data = hitDist.map((likelihood, dmg) => ({
			damage: dmg,
			likelihood: likelihood.toFixed(4)
		}));

		const badges = calcs.flags.map((flag, i) => (
			<span key={i} className="info-badge" data-tooltip={flagDescriptions[flag]}>{flag}</span>)
		);

		let marginSides = 5;
		let graphHeight = 400;
		if (!this.state.expand) {
			marginSides = 7;
			graphHeight = 100;
			data.shift();
		}

		let specialAttackDiv;
		if (this.props.calcs.specCalcs) {
			specialAttackDiv = (
				<div>
					<button
						className={this.state.spec ? "" : "selected"}
						onClick={() => this.setState({ spec: false })}
					>
						Standard
					</button>
					<button
						className={this.state.spec ? "selected" : ""}
						onClick={() => this.setState({ spec: true })}
					>
						{this.props.calcs.specCalcs.specName}
					</button>
				</div>
			);
		}

		let badgeHolder;
		if (calcs.flags.length > 0) {
			badgeHolder = <div className="info-badge-holder">{badges}</div>;
		}

		return (
			<div className="flex-container-vertical" style={{
				padding: "1em",
				border: "1px dashed #666"
			}}>
				{specialAttackDiv}
				<CalcOutputNumbers calcs={calcs} ttk={this.props.ttk} spec={specMode}/>
				<div>
					<div className="color-grey" style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					}}>
						Hit Distribution {this.state.expand ? "" : " (dmg > 0)"}
						<span style={{ display: "inline-flex" }}>
							<span className="sub-text" style={{ marginRight: "0.5em", display: "inline-block" }}>Expand</span>
							<label className="toggle-control" style={{ float: "right" }}>
								<input readOnly type="checkbox" checked={this.state.expand} onClick={this.toggleExpand}/>
								<span className="control"></span>
							</label>
						</span>

					</div>
					<div style={{ position: "relative" }}>
						<ResponsiveContainer width="100%" height={graphHeight}>
							<BarChart
								width={500}
								data={data}
								margin={{
									top: 5,
									right: marginSides,
									left: marginSides + 3,
									bottom: 5
								}}
								stackOffset="expand"
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#666"/>
								<XAxis dataKey="damage" name="Damage" stroke="#ddd"/>
								<YAxis stroke="#ddd" tickFormatter={toPercent} type="number"/>
								<Tooltip className="highlight-section" fill="#666"/>
								<Bar dataKey="likelihood" fill="#9eff74" tickFormatter={toPercent} isAnimationActive={false}/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				{badgeHolder}
			</div>
		);
	}
}
