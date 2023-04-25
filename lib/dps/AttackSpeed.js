import { modifyAttackSpeed } from "./ConditionalModifiers.js";

export class AttackSpeed {
	constructor (state, calcs) {
		this.state = state;
		this.vertex = calcs.vertex;

		// @todo verify if this is needed - in modifyAttackSpeed call
		this.calcs = calcs;
	}

	output () {
		const player = this.state.player;
		if (player.misc.manualSpeed > 0) {
			return player.misc.manualSpeed;
		}

		const attackStyle = player.attackStyle.style;
		let weaponSpeed = player.equipment.weapon.speed;
		if (this.state.player.spell) {
			weaponSpeed = 5;
		}
		else if (attackStyle === "Rapid") {
			weaponSpeed -= 1;
		}

		weaponSpeed = modifyAttackSpeed(weaponSpeed, this.calcs, this.state.player, this.state.monster);
		return weaponSpeed;
	}
}
