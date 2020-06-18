import * as isoly from "isoly"
import * as payfunc from "@payfunc/model"
import { addCommand } from "./Module"
import * as gracely from "gracely"
import * as authly from "authly"
import { Connection } from "../Connection"
import { post } from "./post"

export async function create(connection: Connection, order: payfunc.Order.Creatable): Promise<authly.Token | gracely.Error> {
	const response = await post(connection, order)
	let result: authly.Token | gracely.Error
	result = response
	return result
}
addCommand({
	name: "create",
	description: "Create a order.",
	examples: [
		["13.37 EUR card <reference token>", "Create order."],
	],
	execute: async (connection, argument, flags) => {
		const items = Number.parseFloat(argument[0])
		const currency = argument[1]
		const type = argument[2]
		const result = connection &&
			payfunc.Payment.Type.is(type) && type == "card" &&
			isoly.Currency.is(currency) &&
			await create(connection, {
				
				items, currency,
				payment: {
					type,
					reference: argument[3],
				},
			}, )
		console.info("\n" + (typeof result == "string" ? result : JSON.stringify(result, undefined, "\t")))
		return !!(typeof result == "string" && payfunc.Order.verify(result))
	}
})
