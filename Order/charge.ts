import * as gracely from "gracely"
import * as payfunc from "@payfunc/model"
import { Connection } from "../Connection"
import { addCommand } from "./Module"

export function charge(connection: Connection, id: string, amount?: number): Promise<payfunc.Event.Charge | gracely.Error> {
	const event: Omit<payfunc.Event.Charge, "date"> = { type: "charge" }
	if (amount != undefined)
		event.items = amount
	return connection.post<payfunc.Event.Charge>("private", `order/${ id }/event`, event)
}
addCommand({
	name: "charge",
	description: "Charges order.",
	examples: [
		["<order id>", "Charges order."],
		["<order id> <amount>", "Charges amount of order."],
	],
	execute: async (connection, argument, flags) => {
		const amount = Number.parseFloat(argument[1])
		const result = connection &&
			await charge(connection, argument[0], amount)
		console.info(JSON.stringify(result, undefined, "\t"))
		return payfunc.Event.Charge.is(result)
	}
})
