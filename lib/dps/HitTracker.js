const sumArray = (arr) => {
	let total = 0;
	for (let i = 0; i < arr.length; i++) {
		total += arr[i];
	}

	return total;
};

export class HitTracker {
	#distribution = new Map();
	#maxHit = 0;
	#hitChance;
	#missChance;

	#storeMultipleWarningNotified = false;

	setZeroAccuracy (accuracy) {
		this.storeSingle(0, 1 - accuracy);
		this.#missChance = 1 - accuracy;
		this.#hitChance = accuracy;

		return this;
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
	 * @return {HitTracker}
	 */
	createBasicDistribution (maxHit, accuracy) {
		this.setZeroAccuracy(accuracy);

		for (let i = 0; i <= maxHit; i++) {
			this.storeSingle(i, accuracy / (maxHit + 1));
		}

		return this;
	}

	storeSingle (hit, p) {
		this.#add(hit, p);
	}

	storeMultiple (hitList, p) {
		if (!this.#storeMultipleWarningNotified) {
			this.#storeMultipleWarningNotified = true;
			console.warn("Using storeMultiple in a single hit tracker. Consider using the multi-hit tracker.");
		}

		const damage = sumArray(hitList);
		this.#add(damage, p);
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
		return [this.#maxHit];
	}

	get distribution () {
		return this.#distribution;
	}

	/**
	 * @deprecated
	 */
	getFreqs () {
		console.warn("getFreqs is deprecated - use getFinalDistribution");

		const hitList = [];
		for (const [dmg, p] of this.#distribution.entries()) {
			hitList.push({ dmg: [dmg], p });
		}

		return hitList;
	}

	#add (damage, p) {
		if (!this.#distribution.has(damage)) {
			this.#distribution.set(damage, 0);
		}

		if (damage > this.#maxHit) {
			this.#maxHit = damage;
		}

		const hitP = this.#distribution.get(damage);
		this.#distribution.set(damage, hitP + p);
	}

	applyFlatBonus (bonus) {
		const originalDistribution = new Map(this.#distribution);
		this.clear();

		for (const [dmg, p] of originalDistribution.entries()) {
			let damage = Math.trunc(dmg + bonus);
			if (damage < 0) {
				damage = 0;
			}

			this.storeSingle(damage, p);
		}
	}

	applyMultiplier (multiplier) {
		if (multiplier < 0) {
			throw new Error("Damage multiplier cannot be negative");
		}

		const originalDistribution = new Map(this.#distribution);
		this.clear();

		for (const [dmg, p] of originalDistribution.entries()) {
			this.storeSingle(Math.trunc(dmg * multiplier), p);
		}
	}

	clamp (max) {
		let updated = false;
		for (const [damage, p] of this.#distribution) {
			if (damage <= max) {
				continue;
			}

			updated = true;
			this.#add(max, p);
			this.#distribution.delete(damage);
		}

		if (updated) {
			this.#maxHit = Math.max(...this.#distribution.keys());
		}
	}

	redistribute (max, hitList) {
		let removedP = 0;
		for (const [damage, p] of this.#distribution) {
			if (damage <= max) {
				continue;
			}

			removedP += p;
			this.#distribution.delete(damage);
		}

		if (removedP === 0) {
			return;
		}

		this.#maxHit = Math.max(...this.#distribution.keys());

		const replacementP = removedP / hitList.length;
		for (const replacementHit of hitList) {
			this.#add(replacementHit, replacementP);
		}
	}

	clear () {
		this.#distribution.clear();
		this.#maxHit = 0;
	}
}

export class MultiHitTracker {
	#hitAmount;
	/** @type {HitTracker[]} */
	#hitTrackers = [];

	constructor (hits) {
		this.#hitAmount = hits;

		for (let i = 0; i < hits; i++) {
			this.#hitTrackers[i] = new HitTracker();
		}
	}

	setZeroAccuracy (accuracy) {
		for (const hitTracker of this.#hitTrackers) {
			hitTracker.setZeroAccuracy(accuracy);
		}

		return this;
	}

	createBasicDistribution (maxHits, accuracy) {
		if (this.#hitAmount !== maxHits.length) {
			throw new Error("The amount of max hits does not match the multi hit tracker's hit amount");
		}

		for (let i = 0; i < this.#hitTrackers.length; i++) {
			const hitTracker = this.#hitTrackers[i];
			const maxHit = maxHits[i];

			hitTracker.createBasicDistribution(maxHit, accuracy);
		}

		return this;
	}

	store (maxHits, accuracy) {
		if (this.#hitAmount !== maxHits.length) {
			throw new Error("The amount of max hits does not match the multi hit tracker's hit amount");
		}

		for (let i = 0; i < this.#hitTrackers.length; i++) {
			this.#hitTrackers[i].storeSingle(maxHits[i], accuracy);
		}
	}

	applyFlatBonus (bonus) {
		for (const hitTracker of this.#hitTrackers) {
			hitTracker.applyFlatBonus(bonus);
		}
	}

	applyFlatBonuses (bonuses) {
		if (this.#hitAmount !== bonuses.length) {
			throw new Error("The amount of bonuses does not match the multi hit tracker's hit amount");
		}

		for (let i = 0; i < this.#hitTrackers.length; i++) {
			const hitTracker = this.#hitTrackers[i];
			const bonus = bonuses[i];

			hitTracker.applyFlatBonus(bonus);
		}
	}

	applyMultiplier (multiplier) {
		for (const hitTracker of this.#hitTrackers) {
			hitTracker.applyMultiplier(multiplier);
		}
	}

	applyMultipliers (multipliers) {
		if (this.hitAmount !== multipliers.length) {
			throw new Error("The amount of multipliers does not match the multi hit tracker's hit amount");
		}

		for (let i = 0; i < this.#hitTrackers.length; i++) {
			const hitTracker = this.#hitTrackers[i];
			const multiplier = multipliers[i];

			hitTracker.applyFlatBonus(multiplier);
		}
	}

	clamp (max) {
		for (const hitTracker of this.#hitTrackers) {
			hitTracker.clamp(max);
		}
	}

	redistribute (max, hitList) {
		for (const hitTracker of this.#hitTrackers) {
			hitTracker.redistribute(max, hitList);
		}
	}

	combine () {
		const result = new HitTracker();
		const distributions = this.#hitTrackers.map(i => i.getFinalDistribution());
		const distributionValues = distributions.map(i => [...i.values()]);

		const thresholds = distributions.map(i => i.size);
		const product = distributions.reduce((acc, cur) => acc * cur.size, 1);

		const damageRolls = new Array(this.#hitTrackers.length).fill(0);
		const lastRoll = damageRolls.length - 1;

		for (let index = 0; index < product; index++) {
			// @todo possibly refactor so this carry-over system looks better to use?
			damageRolls[lastRoll]++;

			if (damageRolls[lastRoll] >= thresholds[lastRoll]) {
				damageRolls[lastRoll] = 0;

				for (let remaining = lastRoll - 1; remaining >= 0; remaining--) {
					damageRolls[remaining]++;

					if (damageRolls[remaining] >= thresholds[remaining]) {
						damageRolls[remaining] = 0;
					}
					else {
						break;
					}
				}
			}

			let p = 1;
			for (let j = 0; j < damageRolls.length; j++) {
				p *= distributionValues[j][damageRolls[j]];
			}

			const damage = sumArray(damageRolls);
			result.storeSingle(damage, p);
		}

		return result;
	}

	get distributions () {
		return this.#hitTrackers.map(i => i.distribution);
	}

	get maxHit () {
		let maxHit = 0;
		for (const hitTracker of this.#hitTrackers) {
			maxHit += hitTracker.maxHit;
		}

		return maxHit;
	}

	get maxList () {
		return this.#hitTrackers.map(i => i.maxHit);
	}
}
