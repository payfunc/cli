import { createOrUpdate } from "./create"
import { list } from "./list"

export const agentModule = {
	name: "agent",
	description: "Creates, updates and lists agents.",
	commands: {
		create: createOrUpdate.command,
		list: list.command,
	},
}

export { createOrUpdate, list, agentModule as module }
