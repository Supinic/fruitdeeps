import fs from "fs";
import csv from "csv-parser";

const bonuslist = [
	"hitpoints",
	"att",
	"str",
	"def",
	"mage",
	"range",
	"attbns",
	"strbns",
	"amagic",
	"mbns",
	"arange",
	"rngbns",
	"dstab",
	"dslash",
	"dcrush",
	"dmagic",
	"drange"
];

const npcList = [];
fs.createReadStream("./importstuff/wiki_monster_data.csv")
	.pipe(csv())
	.on("data", (row) => {
		// Check if row is populated
		if (!row.name) {
			return;
		}

		// parse image name, e.g.: [[File:Mithril dragon.png|280px]]
		const filename = (row.image)
			? row.image.match(/File:(.+?)[|\]]/)[1]
			: null;

		const monster = {
			name: row.name,
			image: filename,
			version: row.version,
			version_number: (row.version_number) ? Number(row.version_number) : null,
			combat: Number(row.combat ?? 0),
			size: Number(row.size ?? 1),
			attributes: [],
			stats: {}
		};

		const attributes = new Set();
		const rawAttributes = row.attributes.split(",").map(i => i.trim()).filter(Boolean);
		for (const attribute of rawAttributes) {
			if (attribute.includes("vampyre")) {
				attributes.add("vampyre");
			}

			attributes.add(attribute);
		}

		monster.attributes = [...attributes];

		for (const bonus of bonuslist) {
			monster.stats[bonus] = Number(row[bonus] ?? 0);
		}

		npcList.push(monster);
	})
	.on("end", async () => {
		fs.writeFileSync("./public/assets/npcs.json", JSON.stringify(npcList));
		console.log("All NPCs parsed successfully");
		process.exit();
	});
