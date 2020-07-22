import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function list(connection: cardfunc.Connection): Promise<payfunc.Merchant[] | gracely.Error> {
		return connection.get<payfunc.Merchant[]>("admin", "merchant")
}
export namespace list {
	export const command: paramly.Command<cardfunc.Connection> = {
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
	}
}
