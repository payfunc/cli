import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import { create } from "./create"
import { list } from "./list"

const accountModule: paramly.Module<cardfunc.Connection> = {
	name: "account",
	description: "Create account.",
	commands: {
		create: create.command,
		list: list.command,
	},
}

export { create, list, accountModule as module }
