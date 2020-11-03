import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"

export function list(connection: cli.Connection): Promise<payfunc.Order[] | gracely.Error> {
	return connection.get<payfunc.Order[]>("private", "account")
}
export namespace list {
	export const command: paramly.Command<cli.Connection> = {
		name: "list",
		description: "Lists accounts.",
		examples: [["", "List all accounts."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await list(connection))
			console.info(JSON.stringify(result, undefined, "\t"))
			return Array.isArray(result)
		},
	}
}
