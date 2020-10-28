import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function createOrUpdate(
	connection: cardfunc.Connection,
	id: string,
	merchant: payfunc.Key.Creatable
): Promise<payfunc.Agent | gracely.Error> {
	return connection.put<payfunc.Agent>("admin", `agent/${id}`, merchant)
}
export namespace createOrUpdate {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "create",
		description: "Create a new agent or update existing agent.",
		examples: [["<Id> '<cardfunc json>'", "Create a new agent or update existing agent."]],
		execute: async (connection, argument, flags) => {
			const agent = JSON.parse(argument[1])
			const id = argument[0]
			const result = connection && payfunc.Key.Creatable.is(agent) && (await createOrUpdate(connection, id, agent))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
