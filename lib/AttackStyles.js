import categoryTable from "./attack-styles.json";

export function AttackStyles (category) {
	return categoryTable[category] ?? categoryTable.Unarmed;
}
