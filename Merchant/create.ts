import * as gracely from "gracely"
import * as paramly from "paramly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function create(
	connection: cli.Connection,
	merchant: payfunc.Key.Creatable
): Promise<payfunc.Merchant | gracely.Error> {
	return connection.post<payfunc.Merchant>("agent", `merchant`, merchant)
}
export namespace create {
	export const command: paramly.Command<cli.Connection> = {
		name: "create",
		description: "Create a new merchant.",
		examples: [["'<cardfunc json>'", "Create a new merchant."]],
		execute: async (connection, argument, flags) => {
			const merchant = JSON.parse(argument[0])
			const result = connection && payfunc.Key.Creatable.is(merchant) && (await create(connection, merchant))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
