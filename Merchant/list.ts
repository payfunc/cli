import * as gracely from "gracely"
import * as payfunc from "@payfunc/model";
import { Connection } from "../Connection";
import { addCommand } from "./Module"

export async function list(connection: Connection): Promise<payfunc.Merchant[] | gracely.Error> {
		return connection.get<payfunc.Merchant[]>("admin", "merchant")
}
addCommand({
	name: "list",
	description: "List merchants.",
	examples: [
		["", "Lists all merchants."],
	],
	execute: async (connection, argument, flags) => {
		const result = connection && await list(connection)
		console.info(JSON.stringify(result, undefined, "\t"))
		return Array.isArray(result)
	}
})
