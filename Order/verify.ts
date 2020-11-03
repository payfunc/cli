import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"

export function verify(Order: string): Promise<payfunc.Order | undefined> {
	return payfunc.Order.verify(Order)
}
export namespace verify {
	export const command: paramly.Command<cli.Connection> = {
		name: "verify",
		description: "Verifies order.",
		examples: [["<order>", "Verifies order."]],
		execute: async (connection, argument, flags) => {
			const result = await verify(argument[0])
			console.info(JSON.stringify(result, undefined, "\t"))
			return !!result
		},
	}
}
