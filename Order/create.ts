import * as isoly from "isoly"
import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import { post } from "./post"

export async function create(
	connection: cardfunc.Connection,
	order: payfunc.Order.Creatable,
	auto3d?: boolean
): Promise<authly.Token | gracely.Error> {
	let result: authly.Token | gracely.Error
	const response = await post(connection, order)
	if (
		auto3d &&
		payfunc.Payment.Card.Creatable.is(order.payment) &&
		order.payment.card &&
		cardfunc.Pares.missing(response)
	) {
		const pares = await cardfunc.Pares.get(response)
		const card = await Card.update(connection, order.payment.card, { pares })
		if (gracely.Error.is(card))
			result = card
		else {
			order.payment.card = card
			result = await post(connection, order)
		}
	} else
		result = response
	return result
}
export namespace create {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "create",
		description: "Create a order.",
		examples: [
			["card <authorization token> 13.37 EUR", "Create order using authorization token."],
			["card <card token> 13.37 EUR", "Create order using card token."],
			["card auto <card token> 13.37 EUR", "Create order using card token automatically do 3D secure (only testing)."],
		],
		execute: async (connection, argument, flags) => {
			const type = argument[0]
			const auto = argument[1] == "auto"
			if (auto)
				argument.splice(1, 1)
			const items = Number.parseFloat(argument[2])
			const currency = argument[3]
			let payment: payfunc.Payment.Creatable | undefined
			if (payfunc.Payment.Type.is(type))
				switch (type) {
					case "card":
						payment = (await cardfunc.Authorization.verify(argument[1]))
							? { type, reference: argument[1] }
							: { type, card: argument[1] }
						break
				}
			const result =
				connection &&
				payment &&
				isoly.Currency.is(currency) &&
				(await create(
					connection,
					{
						items,
						currency,
						payment,
					},
					auto
				))
			console.info("\n" + (typeof result == "string" ? result : JSON.stringify(result, undefined, "\t")))
			return !!(typeof result == "string" && payfunc.Order.verify(result))
		},
	}
}
