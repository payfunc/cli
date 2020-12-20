import * as gracely from "gracely"
import * as paramly from "paramly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function update(
	connection: cli.Connection,
	id: string,
	merchant: payfunc.Key.Creatable
): Promise<payfunc.Merchant | gracely.Error> {
	return connection.put<payfunc.Merchant>("agent", `merchant/${id}`, merchant)
}
export namespace update {
	export const command: paramly.Command<cli.Connection> = {
		name: "update",
		description: "Update merchant.",
		examples: [["<Id> '<cardfunc json>'", "Update merchant."]],
		execute: async (connection, argument, flags) => {
			const merchant = JSON.parse(argument[1])
			const id = argument[0]
			const result = connection && payfunc.Key.Creatable.is(merchant) && (await update(connection, id, merchant))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
