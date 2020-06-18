import * as payfunc from "@payfunc/model"
import { addCommand } from "./Module"

export function verify(Order: string): Promise<payfunc.Order | undefined> {
	return payfunc.Order.verify(Order)
}
addCommand({
	name: "verify",
	description: "Verifies order.",
	examples: [
		["<order>", "Verifies order."],
	],
	execute: async (connection, argument, flags) => {
		const result = await verify(argument[0])
		console.info(JSON.stringify(result, undefined, "\t"))
		return !!result
	}
})

