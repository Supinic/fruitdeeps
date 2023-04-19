import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import Image from "next/image";

import { Attacker } from "./Attacker.js";
import Player from "../lib/Player.js";
import { PlayerDataProperty } from "./types/PlayerDataProperty.js";

const MAXIMUM_PLAYER_SET_AMOUNT = 10;

class AttackerSwitcherInner extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		playerList: PropTypes.arrayOf(PlayerDataProperty),
		addPlayer: PropTypes.func,
		deletePlayer: PropTypes.func,
		setPlayer: PropTypes.func
	};

	constructor (props) {
		super(props);

		this.state = {
			playerSelected: 0,
			deleteMode: false
		};

		this.clone = this.clone.bind(this);
	}

	buttons () {
		return this.props.playerList.map((player, i) => (
			<button
				key={i}
				className={(this.state.playerSelected === i) ? "selected" : ""}
				onClick={() => this.setState({ playerSelected: i, deleteMode: false })}
			>
				Set {i + 1}
			</button>
		));
	}

	clone () {
		this.props.addPlayer();
		this.props.setPlayer(this.props.playerList.length)(this.props.playerList[this.state.playerSelected]);
	}

	render () {
		const i = this.state.playerSelected;
		const player = new Player(this.props.playerList[i]);

		let highlightSectionElement;
		if (this.state.deleteMode) {
			highlightSectionElement = (
				<div style={{ marginBottom: "0.5em" }}>
					<span className="sub-text">Delete?</span>
					<button
						className="seamless"
						onClick={() => {
							this.props.deletePlayer(this.state.playerSelected);
							this.setState({
								deleteMode: false,
								playerSelected: 0
							});
						}}>yes
					</button>
				|
					<button className="seamless" onClick={() => this.setState({ deleteMode: false })}>no</button>
				</div>);
		}
		else {
			let deleteButton;
			if (this.props.playerList.length > 1) {
				deleteButton = (
					<button className="seamless" onClick={() => this.setState({ deleteMode: true })}>Delete</button>
				);
			}

			let separator;
			if (this.props.playerList.length > 1 && this.props.playerList.length < MAXIMUM_PLAYER_SET_AMOUNT) {
				separator = "|";
			}

			let cloneButton;
			if (this.props.playerList.length > 1 && this.props.playerList.length < MAXIMUM_PLAYER_SET_AMOUNT) {
				cloneButton = <button className="seamless" onClick={this.clone}>Clone</button>;
			}

			highlightSectionElement = (
				<div style={{ marginBottom: "0.5em" }}>
					{deleteButton}
					{separator}
					{cloneButton}
				</div>
			);
		}

		return (
			<div className="flex-container-vertical">
				<div className="flex-container-vertical">
					<h2 className="flex-valign">
						<img alt="Attack" style={{ height: "0.75em" }} src="/assets/svg/attack_icon.svg"/>
						<span className="space-left">Set {i + 1}</span>
					</h2>

					<Attacker
						player={player}
						setPlayer={this.props.setPlayer(i)}
					/>
				</div>
				<div className="highlight-section">
					{highlightSectionElement}
					<div>
						{this.buttons()}
						{
							(this.props.playerList.length < MAXIMUM_PLAYER_SET_AMOUNT)
								? <button className="seamless" onClick={this.props.addPlayer}>Add set</button>
								: null
						}
					</div>
				</div>
			</div>
		);
	}
}

class AttackerSwitcher extends Component {
	static propTypes = {
		playerList: PropTypes.arrayOf(PropTypes.instanceOf(Player)),
		addPlayer: PropTypes.func,
		deletePlayer: PropTypes.func,
		setPlayer: PropTypes.func
	};

	render () {
		return (
			<AttackerSwitcherInner
				playerList={this.props.playerList}
				setPlayer={this.props.setPlayer}
				addPlayer={this.props.addPlayer}
				deletePlayer={this.props.deletePlayer}
			/>
		);
	}
}

function mapStateToProps (state) {
	return {
		playerList: state.playerList
	};
}

function mapDispatchToProps (dispatch) {
	return {
		setPlayer: (i) => (player) => dispatch({ type: "SET_PLAYER", player, index: i }),
		addPlayer: () => dispatch({ type: "ADD_NEW_PLAYER" }),
		deletePlayer: (i) => dispatch({ type: "DELETE_PLAYER", index: i })
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AttackerSwitcher);
