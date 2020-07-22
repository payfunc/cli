import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import { card } from "./card"

const testModule: paramly.Module<cardfunc.Connection> = {
	name: "order",
	description: "Create order.",
	commands: {
		card: card.command,
		_: {
			name: "_",
			description: "Runs tests.",
			examples: [["", "Invoke all tests."]],
			execute: async (connection, argument, flags) => {
				console.info("PayFunc Test\n")
				const result = (await Promise.all(Object.values(testModule.commands).filter(c => c?.name != "_").map(async c => {
					const r = await c?.execute(connection, argument, flags)
					console.info(c?.name.padEnd(20, ".") + (r ? "ok" : "fail").padStart(4, "."))
					return !!r
				}))).every(r => r)
				console.info()
				return result
			}
		}
	},
}

export {
	card,
	testModule as module,
}
