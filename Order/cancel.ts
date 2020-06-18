import * as gracely from "gracely"
import * as payfunc from "@payfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function cancel(connection: Connection, id: string): Promise<payfunc.Event.Cancel | gracely.Error> {
	const event: Omit<payfunc.Event.Cancel, "date"> = { type: "cancel" }
	return connection.post<payfunc.Event.Cancel>("private", `order/${ id }/event`, event)
}
addCommand({
	name: "cancel",
	description: "Cancels order.",
	examples: [
		["<order id>", "Cancels order."],
	],
	execute: async (connection, argument, flags) => {
		const result = connection &&
			await cancel(connection, argument[0])
		console.info(JSON.stringify(result, undefined, "\t"))
		return payfunc.Event.Cancel.is(result)
	}
})
