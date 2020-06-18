import * as gracely from "gracely"
import * as payfunc from "@payfunc/model";
import { Connection } from "../Connection";
import { addCommand } from "./Module"

export async function create(connection: Connection, merchant: payfunc.Merchant.Creatable): Promise<payfunc.Merchant | gracely.Error> {
		return connection.post<payfunc.Merchant>("admin", `merchant`, merchant)
}
addCommand({
	name: "create",
	description: "Create a new merchant.",
	examples: [
		["\'<cardfunc json>\'", "Create a new merchant."],
	],
	execute: async (connection, argument, flags) => {
		const merchant = JSON.parse(argument[0])
		const result = connection && payfunc.Merchant.Creatable.is(merchant) && await create(connection, merchant)
		console.info(JSON.stringify(result, undefined, "\t"))
		return !gracely.Error.is(result)
	}
})
