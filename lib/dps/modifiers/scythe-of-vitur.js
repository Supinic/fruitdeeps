import { HitFreqStore } from "../HitFreqStore.js";

export function applyModifier (dps) {
	const acc = dps.accuracy;

	const m1 = dps.maxHit;
	const m2 = Math.trunc(m1 / 2);
	const m3 = Math.trunc(m1 / 4);

	const scytheHitStore = new HitFreqStore();

	for (let hit1 = 0; hit1 <= m1; hit1++) {
		let p1 = acc / (m1 + 1);
		if (hit1 === 0) {
			p1 += 1 - acc;
		}

		for (let hit2 = 0; hit2 <= m2; hit2++) {
			let p2 = acc / (m2 + 1);
			if (hit2 === 0) {
				p2 += 1 - acc;
			}

			for (let hit3 = 0; hit3 <= m3; hit3++) {
				let p3 = acc / (m3 + 1);
				if (hit3 === 0) {
					p3 += 1 - acc;
				}

				scytheHitStore.store([hit1, hit2, hit3], p1 * p2 * p3);
			}
		}
	}

	dps.hitStore = scytheHitStore;
	dps.maxList = [m1, m2, m3];
	dps.maxHit = m1 + m2 + m3;

	return dps;
}

export function isApplied (dps, player) {
	// Includes all the ornamental versions from HM TOB, e.g. `Holy scythe of vitur`, etc.
	return (player.equipment.weapon.name.toLowerCase().includes("scythe of vitur"));
}
