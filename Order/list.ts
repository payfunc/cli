import * as gracely from "gracely"
import * as paramly from "paramly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export function list(connection: cli.Connection): Promise<payfunc.Order[] | gracely.Error> {
	return connection.get<payfunc.Order[]>("private", "order")
}
export namespace list {
	export const command: paramly.Command<cli.Connection> = {
		name: "list",
		description: "Lists orders.",
		examples: [["", "List all orders."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await list(connection))
			console.info(JSON.stringify(result, undefined, "\t"))
			return Array.isArray(result)
		},
	}
}
