import * as gracely from "gracely"
import * as paramly from "paramly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function list(connection: cli.Connection): Promise<payfunc.Merchant[] | gracely.Error> {
	return connection.get<payfunc.Merchant[]>("agent", "merchant")
}
export namespace list {
	export const command: paramly.Command<cli.Connection> = {
		name: "list",
		description: "List merchants.",
		examples: [["", "Lists all merchants."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await list(connection))
			console.info(JSON.stringify(result, undefined, "\t"))
			return Array.isArray(result)
		},
	}
}
