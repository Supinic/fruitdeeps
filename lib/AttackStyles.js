import categoryTable from "./attack-styles.json" assert { type: "json" };

export function AttackStyles (category) {
	return categoryTable[category] ?? categoryTable.Unarmed;
}
