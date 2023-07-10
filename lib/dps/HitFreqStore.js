const sumArray = (arr) => {
	let total = 0;
	for (let i = 0; i < arr.length; i++) {
		total += arr[i];
	}

	return total;
};

export class HitFreqStore {
	#distribution = new Map();
	#possibleHits;
	#hitAmount;

	#maxHit = 0;
	#maxList = [];

	#hitChance;
	#missChance;

	constructor (hits) {
		if (hits) {
			this.#hitAmount = hits;
			this.#possibleHits = new Array(hits).fill(new Set());
		}
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
	 * @return {HitFreqStore}
	 */
	createBasicDistribution (maxHit, accuracy) {
		if (this.#hitAmount && this.#hitAmount !== 1) {
			throw new Error("Cannot initialize a basic distribution for a multi-hit frequency store");
		}

		this.storeSingle(0, 1 - accuracy);

		for (let i = 0; i <= maxHit; i++) {
			this.storeSingle(i, accuracy / (maxHit + 1));
		}

		return this;
	}

	storeSingle (hit, p) {
		if (this.#hitAmount && this.#hitAmount !== 1) {
			throw new Error("Cannot use storeSingle for a multi-hit frequency store");
		}

		if (!this.#distribution.has(hit)) {
			this.#distribution.set(hit, 0);
		}

		if (hit > this.#maxHit) {
			this.#maxHit = hit;
		}

		const hitP = this.#distribution.get(hit);
		this.#distribution.set(hit, hitP + p);
	}

	storeMultiple (hitList, p) {
		if (this.#hitAmount) {
			if (this.#hitAmount === 1) {
				throw new Error("Cannot use storeMultiple for a single-hit frequency store");
			}
			else if (this.#hitAmount !== hitList.length) {
				throw new Error("Hit amount mismatch");
			}
		}

		const damage = sumArray(hitList);
		this.storeSingle(damage, p);

		for (let i = 0; i < hitList.length; i++) {
			if (this.#maxList[i] === undefined || hitList[i] > this.#maxList) {
				this.#maxList[i] = hitList[i];
			}
		}
	}

	store (hitList, p) {
		if (hitList.length === 1) {
			console.warn("Deprecated, use storeSingle");
		}
		else if (hitList.length > 1) {
			console.warn("Deprecated, use storeMultiple");
		}

		this.storeMultiple(hitList, p);
	}

	getFinalDistribution () {
		const dist = new Map(this.#distribution);
		for (let i = 0; i < this.#maxHit; i++) {
			if (!dist.has(i)) {
				dist.set(i, 0);
			}
		}

		return dist;
	}

	get maxHit () {
		return this.#maxHit;
	}

	get maxList () {
		return this.#maxList;
	}

	getFreqs () {
		const hitList = [];
		for (const [dmg, p] of this.#distribution.entries()) {
			hitList.push({ dmg: [dmg], p });
		}

		return hitList;
	}
}
