import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, ReferenceLine
} from "recharts";

import { CalcsProperty } from "./types/CalcsProperty.js";
import { StateProperty } from "./types/StateProperty.js";

import {
	getDefenceReductionPoints,
	createDamageDefenceGraphData
} from "../lib/dps/overhit/DpsDefence.js";

const colors = ["#9EFF74", "#74C7FF", "#FF8274", "#EEEEEE", "#D574FF", "#FFAC74", "#74F1FF"];

const createDefenceReductionLine = (label, defence, colour = "#f00") => (
	<ReferenceLine
		key={label}
		x={defence}
		stroke={colour}
		style={{ strokeDasharray: "15,10" }}
	>
		<Label
			value={label}
			angle="-90"
			dx={-14}
			dy={18}
			position="insideTop"
			fill="#eeeeee"
			style={{
				fontFamily: "Roboto Slab",
				fontSize: "1em"
			}}
		/>
	</ReferenceLine>
);

export class DpsOverDefenceGraph extends Component {
	static propTypes = {
		calcsList: PropTypes.arrayOf(CalcsProperty),
		state: StateProperty
	};

	constructor (props) {
		super(props);

		this.state = {
			data: [],
			id: null,
			expand: false
		};

		this.calculate = this.calculate.bind(this);
		this.generateId = this.generateId.bind(this);
		this.toggleExpand = this.toggleExpand.bind(this);
	}

	generateId () {
		return JSON.stringify({
			calcsList: this.props.calcsList,
			state: this.props.state
		});
	}

	toggleExpand () {
		this.setState({ expand: !this.state.expand });
	}

	calculate () {
		if (typeof window === "undefined") {
			return;
		}

		const dpsList = this.props.calcsList;
		const { playerList, monster } = this.props.state;
		const { graphData } = createDamageDefenceGraphData(playerList, dpsList, monster);

		this.setState({
			data: graphData,
			id: this.generateId()
		});
	}

	render () {
		if (this.state.id !== this.generateId()) {
			this.calculate();
		}

		const lines = this.props.calcsList.map((calcs, i) => (
			<Line
				key={i}
				isAnimationActive={false}
				type="monotone"
				dot={false}
				dataKey={`Set ${i + 1}`}
				stroke={colors[i % 4]}
				strokeWidth={3}
			/>
		));

		const baseDefence = this.props.state.monster.stats.def;
		const specialLines = [];
		const specialDefencePoints = getDefenceReductionPoints(baseDefence);

		let index = 1;
		for (const value of specialDefencePoints.dwh) {
			const label = `${index} dwh`;
			specialLines.push(createDefenceReductionLine(label, value, "#ff8274"));
			index++;
		}

		specialLines.push(createDefenceReductionLine("vuln", specialDefencePoints.vuln, "#74f1ff"));

		return (
			<div>
				<h3
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					Dps as a Function of Defence @{" "}
					{this.props.state.monster.name}
					<span style={{ display: "inline-flex" }}>
						<label
							className="sub-text"
							htmlFor="dpsOverDefenceToggle"
							style={{
								marginRight: "0.5em",
								display: "inline-block"
							}}
						>
							Expand
						</label>
						<label
							className="toggle-control"
							htmlFor="dpsOverDefenceToggle"
						>
							<input
								readOnly
								type="checkbox"
								id="dpsOverDefenceToggle"
								checked={this.state.expand}
								onClick={this.toggleExpand}
							/>
							<span className="control"></span>
						</label>
					</span>
				</h3>
				<div className="highlight-section">
					<ResponsiveContainer
						width="100%"
						height={this.state.expand ? 400 : 200}
					>
						<LineChart
							data={this.state.data}
							margin={{
								top: 0,
								right: 30,
								left: 20,
								bottom: 20
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#666"
							/>
							<XAxis
								allowDecimals={false}
								interval={0}
								tickCount={10}
								dataKey="defence"
								name="Defence"
								stroke="#ddd"
								type="number"
								reversed="true"
								domain={[0, baseDefence]}
							>
								<Label
									value="Defence"
									offset={0}
									position="insideBottom"
									margin={5}
									dy={10}
									fill="#eeeeee"
									style={{ fontFamily: "Roboto Slab" }}
								/>
							</XAxis>
							<YAxis
								stroke="#ddd"
								type="number"
								domain={["auto", "auto"]}
							>
								<Label
									value="DPS"
									offset={0}
									position="insideLeft"
									angle="-90"
									margin={5}
									dy={10}
									fill="#eeeeee"
									style={{ fontFamily: "Roboto Slab" }}
								/>
							</YAxis>
							<Tooltip className="highlight-section"/>
							<Legend verticalAlign="top"/>
							{specialLines}
							{lines}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}
}
