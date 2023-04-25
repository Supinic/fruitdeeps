import React, { Component } from "react";
// import Image from "next/image";

import { StateProperty } from "./types/StateProperty.js";
import { CalcOutput } from "./CalcOutput.js";
import { CalcOutputOptimizationGraph } from "./CalcOutputOptimizationGraph.js";
import { DpsOverDefenceGraph } from "./DpsOverDefenceGraph.js";
import { Dps } from "../lib/dps/Dps.js";
import Player from "../lib/Player.js";

export class CalcOutputMultiple extends Component {
	static propTypes = {
		state: StateProperty
	};

	constructor (props) {
		super(props);
		const playerList = this.props.state.playerList;

		const ttkManager = playerList.map(() => ({
			id: null,
			ttk: { ttk: null }
		}));

		if (typeof window !== "undefined") {
			this.workerList = playerList.map(() => new Worker(new URL("../lib/workers/general.worker.js", import.meta.url)));
		}

		// this.workerList = playerList.map(() =>  null);
		this.stateInputs = [];

		this.state = {
			ttkManager,
			mounted: false
		};

		this.handleWorker = this.handleWorker.bind(this);
	}

	// componentDidMount(){
	//     this.workerList = playerList.map(() =>  new Worker());
	// }

	generateId (stateInput) {
		return JSON.stringify(stateInput);
	}

	handleWorker (calcs, i) {
		if (typeof window === "undefined") {
			return;
		}

		const id = this.generateId(this.stateInputs[i]);

		if (typeof this.workerList[i] !== "undefined") {
			this.workerList[i].terminate();
		}

		this.workerList[i] = new Worker(new URL("../lib/workers/general.worker.js", import.meta.url));

		this.workerList[i].onmessage = function () {};

		this.workerList[i].addEventListener("message", (event) => {
			if (id === this.generateId(this.stateInputs[i])) {
				const ttkManager = [...this.state.ttkManager];
				ttkManager[i] = {
					id,
					ttk: event.data.overhit
				};
				this.setState({ ttkManager });
			}
		});

		this.workerList[i].postMessage({
			calcs,
			state: this.stateInputs[i],
			type: "Overhit"
		});
	}

	render () {
		const playerList = this.props.state.playerList;
		this.stateInputs = playerList.map((player) => ({
			player,
			monster: this.props.state.monster
		}));

		const calcsList = playerList.map((player, i) => new Dps(this.stateInputs[i]).output());

		const outputBlocks = [];

		// let showChart = true;
		this.stateInputs.map((stateInput, i) => {
			if (typeof this.state.ttkManager[i] === "undefined" || this.generateId(stateInput) !== this.state.ttkManager[i].id) {
				this.handleWorker(calcsList[i], i);
				// showChart = false;
			}
		});

		const dps = playerList.map((player, i) => {
			const playerDpsState = {
				player: new Player(player),
				monster: this.props.state.monster
			};

			const nottk = typeof this.state.ttkManager[i] !== "undefined" && this.generateId(this.stateInputs[i]) === this.state.ttkManager[i].id;
			return (
				<div key={i} className="flex-child">
					<h2>
					Set {i + 1}
						<span className="sub-text">
							{" "}
						@ {this.props.state.monster.name}
						</span>
					</h2>
					<CalcOutput
						dpsState={playerDpsState}
						state={this.props.state}
						calcs={calcsList[i]}
						ttk={nottk ? this.state.ttkManager[i].ttk.ttk : null}
					/>
				</div>
			);
		});

		for (let i = 0; i < playerList.length; i++) {
			if (i % 2 === 0) {
				outputBlocks.push(
					<div key={i} className="flex-container top-level">
						{dps[i]}
						{i < dps.length ? dps[i + 1] : null}
					</div>
				);
			}
		}

		return (
			<div className="flex-container-vertical">
				{outputBlocks}
				<div>
					<h2 className="flex-valign">
						<img
							alt="Stats"
							style={{ height: "0.75em" }}
							src="/assets/svg/stats_icon.svg"
						/>
						<span className="space-left">Set Comparison Graphs</span>
					</h2>
					<div
						className="flex-container-vertical"
						style={{
							padding: "1em",
							border: "1px dashed #666"
						}}
					>
						<CalcOutputOptimizationGraph
							calcsList={calcsList}
							state={this.props.state}
						/>
						<DpsOverDefenceGraph
							calcsList={calcsList}
							state={this.props.state}
						/>
					</div>
				</div>
				{" "}
			</div>);
	}
}
