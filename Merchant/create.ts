import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function create(
	connection: cardfunc.Connection,
	merchant: payfunc.Merchant.Creatable
): Promise<payfunc.Merchant | gracely.Error> {
	return connection.post<payfunc.Merchant>("admin", `merchant`, merchant)
}
export namespace create {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "create",
		description: "Create a new merchant.",
		examples: [["'<cardfunc json>'", "Create a new merchant."]],
		execute: async (connection, argument, flags) => {
			const merchant = JSON.parse(argument[0])
			const result = connection && payfunc.Merchant.Creatable.is(merchant) && (await create(connection, merchant))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
