import * as gracely from "gracely"
import * as payfunc from "@payfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function refund(connection: Connection, id: string, amount?: number): Promise<payfunc.Event.Refund | gracely.Error> {
	const event: Omit<payfunc.Event.Refund, "date"> = { type: "refund" }
	if (amount != undefined)
		event.items = amount
	return connection.post<payfunc.Event.Refund>("private", `order/${ id }/event`, event)
}
addCommand({
	name: "refund",
	description: "Refunds order.",
	examples: [
		["<order id>", "Refunds order."],
		["<order id> <amount>", "Refunds partial amount of order."],
	],
	execute: async (connection, argument, flags) => {
		const amount = Number.parseFloat(argument[1])
		const result = connection &&
			await refund(connection, argument[0], amount)
		console.info(JSON.stringify(result, undefined, "\t"))
		return payfunc.Event.Refund.is(result)
	}
})
