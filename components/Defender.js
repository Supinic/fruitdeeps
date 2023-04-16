import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { MonsterProperty } from "./types/MonsterProperty.js";
import { DefenderTableDisplay } from "./DefenderTableDisplay.js";
import { DefenderImageDisplay } from "./DefenderImageDisplay.js";

class Defender extends Component {
	static propTypes = {
		monster: MonsterProperty,
		setMonster: PropTypes.func,
		setMonsterStat: PropTypes.func
	};

	render () {
		return (<div className="flex-container">
			<div className="flex-child">
				<DefenderImageDisplay
					monster={this.props.monster}
					setMonster={this.props.setMonster}
				/>
			</div>
			<div className="flex-child">
				<DefenderTableDisplay
					monster={this.props.monster}
					setMonsterStat={this.props.setMonsterStat}
					setMonster={this.props.setMonster}
				/>
			</div>
		</div>);
	}
}

function mapStateToProps (state) {
	return {
		monster: state.monster
	};
}

function mapDispatchToProps (dispatch) {
	return {
		setMonster: (monster) => {
			dispatch({
				type: "SET_MONSTER",
				monster
			});
		},

		setMonsterStat: (stat, value) => {
			dispatch({
				type: "MONSTER_SET_STAT",
				stat,
				value
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Defender);
