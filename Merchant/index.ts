import { create } from "./create"
import { list } from "./list"
import { update } from "./update"

export const merchantModule = {
	name: "merchant",
	description: "Creates, updates and lists merchants.",
	commands: {
		create: create.command,
		list: list.command,
		update: update.command,
	},
}

export { create, list, update, merchantModule as module }
