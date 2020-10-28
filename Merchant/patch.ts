import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function patch(
	connection: cardfunc.Connection,
	id: string,
	merchant: payfunc.Key.Creatable
): Promise<payfunc.Merchant | gracely.Error> {
	return connection.patch<payfunc.Merchant>("agent", `merchant/${id}`, merchant)
}
export namespace patch {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "patch",
		description: "Patches merchant.",
		examples: [["<Id> '<cardfunc json>'", "Patch merchant."]],
		execute: async (connection, argument, flags) => {
			const merchant = JSON.parse(argument[1])
			const id = argument[0]
			const result = connection && payfunc.Key.Creatable.is(merchant) && (await patch(connection, id, merchant))
			console.info(JSON.stringify(result, undefined, "\t"))
			return !gracely.Error.is(result)
		},
	}
}
