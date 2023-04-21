import { Overhit } from "./Overhit.js";

export class TtkOptimization {
	constructor (state, calcsList) {
		this.calcsList = calcsList;
		this.state = state;
	}

	output () {
		const graphData = [
			[{ hitpoints: 0 }],
			[{ hitpoints: 0 }]
		];

		for (let i = 0; i < this.calcsList.length; i++) {
			graphData[0][0][`Set ${i + 1}`] = 0;
			graphData[1][0][`Set ${i + 1}`] = 0;
		}

		let memory = [0];
		const maxHp = this.state.monster.stats.hitpoints;
		const overhitList = this.calcsList.map((calcs, i) => new Overhit(
			{
				monster: this.state.monster,
				player: this.state.playerList[i]
			},
			calcs,
			false
		));

		for (let hp = 1; hp <= Math.min(maxHp, 400); hp++) {
			const ttkList = overhitList.map((overhit) => overhit.timeToKill(hp));
			memory[hp] = Math.min(...ttkList);

			if (hp < 401) {
				graphData[0].push({ hitpoint: hp });
				for (const [i, ttk] of ttkList.entries()) {
					if (ttk === memory[hp] && hp <= 401) {
						graphData[0][hp][`Set ${i + 1}`] = parseFloat(ttk.toFixed(2));
					}
				}
			}

			for (const overhit of overhitList) {
				overhit.setMemory([...memory]);
			}
		}

		memory = [0];

		const overhitListContinuous = this.calcsList.map((calcs, i) => new Overhit(
			{
				monster: this.state.monster,
				player: this.state.playerList[i]
			},
			calcs,
			true
		));

		for (let hp = 1; hp <= Math.min(maxHp, 400); hp++) {
			const ttkList = overhitListContinuous.map((overhit) => overhit.timeToKill(hp));
			memory[hp] = Math.min(...ttkList);

			if (hp < 401) {
				graphData[1].push({ hitpoint: hp });
				for (const [i, ttk] of ttkList.entries()) {
					if (ttk === memory[hp] && hp <= 401) {
						graphData[1][hp][`Set ${i + 1}`] = parseFloat(ttk.toFixed(2));
					}
				}
			}

			for (const overhit of overhitListContinuous) {
				overhit.setMemory([...memory]);
			}
		}

		return { graphData, memory };
	}
}
