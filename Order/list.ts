import * as gracely from "gracely"
import * as payfunc from "@payfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function list(connection: Connection): Promise<payfunc.Order[] | gracely.Error> {
	return connection.get<payfunc.Order[]>("private", "order")
}
addCommand({
	name: "list",
	description: "Lists orders.",
	examples: [
		["", "List all orders."],
	],
	execute: async (connection, argument, flags) => {
		const result = connection &&
			await list(connection)
		console.info(JSON.stringify(result, undefined, "\t"))
		return Array.isArray(result)
	}
})
