import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps, player, monster) {
	const acc = dps.accuracy;

	const maxHit = dps.maxHit;
	const maxHit2 = Math.floor(maxHit / 2);
	const maxHit3 = Math.floor(maxHit / 4);

	const scytheHitStore = new HitFreqStore();
	for (let hit1 = 0; hit1 <= maxHit; hit1++) {
		let p1 = acc / (maxHit + 1);
		if (hit1 === 0) {
			p1 += 1 - acc;
		}

		if (monster.size === 1) {
			scytheHitStore.store([hit1], p1);
		}
		else {
			for (let hit2 = 0; hit2 <= maxHit2; hit2++) {
				let p2 = acc / (maxHit2 + 1);
				if (hit2 === 0) {
					p2 += 1 - acc;
				}

				if (monster.size === 2) {
					scytheHitStore.store([hit1, hit2], p1 * p2);
				}
				else {
					for (let hit3 = 0; hit3 <= maxHit3; hit3++) {
						let p3 = acc / (maxHit3 + 1);
						if (hit3 === 0) {
							p3 += 1 - acc;
						}

						scytheHitStore.store([hit1, hit2, hit3], p1 * p2 * p3);
					}
				}
			}
		}
	}

	const maxHitList = [dps.maxHit];
	if (monster.size >= 2) {
		maxHitList.push(maxHit2);
	}
	if (monster.size >= 3) {
		maxHitList.push(maxHit3);
	}

	dps.hitStore = scytheHitStore;
	dps.maxList = maxHitList;
	dps.maxHit = maxHitList.reduce((acc, cur) => acc + cur, 0);

	return dps;
}

export function isApplied (dps, player) {
	// Includes all the ornamental versions from HM TOB, e.g. `Holy scythe of vitur`, etc.
	// This also includes the weaker, uncharged versions
	return (player.equipment.weapon.name.toLowerCase().includes("scythe of vitur"));
}
