class HitFreqItem {
	constructor () {
		this.nextHitList = [];
		this.p = 0;
	}

	next (i) {
		this.nextHitList[i] ??= new HitFreqItem();
		return this.nextHitList[i];
	}

	setP (p) {
		this.p += p;
	}

	getP () {
		return this.p;
	}
}

export class HitFreqStore {
	constructor () {
		this.base = new HitFreqItem();
		this.hitSet = [];
	}

	/**
	 * Creates a basic damage distribution based on game logic.
	 *
	 * For a given "hit probability" `P` (accuracy) and maximum `Max` (max hit) the following is true:
	 * - probability of hitting zero (miss) is (1 - P)
	 * - probability of hitting any value between <0, Max> is (P / (Max + 1))
	 * Since the player can either "miss" or "hit" a zero (the game does not distinguish these - except for Magic),
	 * the probability is weighted towards zero, and the remaining values are all equally likely.
	 *
	 * Naturally, many effects don't follow this distribution. This method is simply syntax sugar for repeated usage.
	 * @param {number} maxHit
	 * @param {number} accuracy
	 */
	createBasicDistribution (maxHit, accuracy) {
		this.store([0], 1 - accuracy);

		for (let i = 0; i <= maxHit; i++) {
			this.store([i], accuracy / (maxHit + 1));
		}
	}

	store (hitList, p) {
		hitList = [...hitList];
		hitList.sort((a, b) => b - a);

		let hitItem = this.base;
		for (let i = 0; i < hitList.length; i++) {
			const dmg = hitList[i];
			hitItem = hitItem.next(dmg);
		}

		if (hitItem.getP() === 0) {
			this.hitSet.push(hitList);
		}

		hitItem.setP(p);
	}

	getFreqs () {
		const hitList = [];
		for (let i = 0; i < this.hitSet.length; i++) {
			let hitItem = this.base;
			for (let j = 0; j < this.hitSet[i].length; j++) {
				hitItem = hitItem.next(this.hitSet[i][j]);
			}

			hitList.push({
				dmg: [...this.hitSet[i]],
				p: hitItem.getP()
			});
		}

		return hitList;
	}
}
