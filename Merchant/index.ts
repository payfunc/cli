import { create } from "./create"
import { list } from "./list"
import { update } from "./update"
import { patch } from "./patch"

export const merchantModule = {
	name: "merchant",
	description: "Creates, updates and lists merchants.",
	commands: {
		create: create.command,
		list: list.command,
		update: update.command,
		patch: patch.command,
	},
}

export { create, list, patch, update, merchantModule as module }
