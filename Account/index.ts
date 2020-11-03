import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import { create } from "./create"
import { list } from "./list"

const accountModule: paramly.Module<cli.Connection> = {
	name: "account",
	description: "Create account.",
	commands: {
		create: create.command,
		list: list.command,
	},
}

export { create, list, accountModule as module }
