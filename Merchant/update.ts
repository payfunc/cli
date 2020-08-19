import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function update(
	connection: cardfunc.Connection,
	id: string,
	merchant: payfunc.Merchant.Creatable
): Promise<payfunc.Merchant | gracely.Error> {
	return connection.put<payfunc.Merchant>("admin", `merchant/${id}`, merchant)
}
export namespace update {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "update",
		description: "Update merchant.",
		examples: [["<Id> '<cardfunc json>'", "Update merchant."]],
		execute: async (connection, argument, flags) => {
			const merchant = JSON.parse(argument[1])
			const id = argument[0]
			const result = connection && payfunc.Merchant.Creatable.is(merchant) && (await update(connection, id, merchant))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
