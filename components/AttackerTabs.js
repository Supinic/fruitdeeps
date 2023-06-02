import React, { Component } from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";
import { AttackerEquipment } from "./AttackerEquipment.js";
import { AttackerStats } from "./AttackerStats.js";
import { AttackerPrayers } from "./AttackerPrayers.js";
import { AttackerSpells } from "./AttackerSpells.js";
import { AttackerImport } from "./AttackerImport.js";
import { AttackerRelics } from "./AttackerRelics.js";
import { AttackerPresets } from "./AttackerPresets.js";
// import Image from "next/image";

class Tab extends Component {
	static propTypes = {
		tab: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		setTab: PropTypes.func,
		tabSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		imgSrc: PropTypes.string
	};

	render () {
		let className = "tab";
		if (this.props.tabSelected === this.props.tab) {
			className += " tab-selected";
		}

		return (
			<span className={className} onClick={() => { this.props.setTab(this.props.tab); }}>
				<img alt="" className="attacker-tab-icon" src={this.props.imgSrc}/>
			</span>
		);
	}
}

export class AttackerTabs extends Component {
	static propTypes = {
		player: PropTypes.instanceOf(Player),
		setPlayer: PropTypes.func
	};

	constructor (props) {
		super(props);

		this.state = { tabSelected: 0 };
		this.setTab = this.setTab.bind(this);
	}

	setTab (tab) {
		this.setState({ tabSelected: tab });
	}

	render () {
		const tab = this.state.tabSelected;
		const displayed = new Array(7).fill("none");
		displayed[tab] = "block";

		const displayBox = (
			<div>
				<div style={{ display: displayed[0] }}>
					<AttackerEquipment player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[1] }}>
					<AttackerStats player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[2] }}>
					<AttackerPrayers player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[3] }}>
					<AttackerSpells player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[4] }}>
					<AttackerRelics player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[5] }}>
					<AttackerPresets player={this.props.player} setTab={this.setTab} setPlayer={this.props.setPlayer}/>
				</div>
				<div style={{ display: displayed[6] }}>
					<AttackerImport player={this.props.player} setPlayer={this.props.setPlayer}/>
				</div>
			</div>

		);

		return (
			<div>
				<div className="tabs">
					<Tab
						tab="0"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/equipment_icon.svg">
					</Tab>
					<Tab
						tab="1"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/stats_icon.svg">
					</Tab>
					<Tab
						tab="2"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/prayer_icon.svg">
					</Tab>
					<Tab
						tab="3"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/spellbook_icon.svg">
					</Tab>
					<Tab
						tab="4"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/toggles_icon.svg">
					</Tab>
					<Tab
						tab="5"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/combat_icon.svg">
					</Tab>
					<Tab
						tab="6"
						tabSelected={this.state.tabSelected}
						setTab={this.setTab}
						imgSrc="/assets/svg/export_icon.svg">
					</Tab>
				</div>
				{displayBox}
			</div>
		);
	}
}
