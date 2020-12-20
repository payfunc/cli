import * as gracely from "gracely"
import * as paramly from "paramly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function list(connection: cli.Connection): Promise<payfunc.Agent[] | gracely.Error> {
	return connection.get<payfunc.Agent[]>("admin", "agent")
}
export namespace list {
	export const command: paramly.Command<cli.Connection> = {
		name: "list",
		description: "List agents.",
		examples: [["", "Lists all agents."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await list(connection))
			console.info(JSON.stringify(result, undefined, "\t"))
			return Array.isArray(result)
		},
	}
}
