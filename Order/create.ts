import * as gracely from "gracely"
import * as isoly from "isoly"
import * as paramly from "paramly"
import * as authly from "authly"
import * as modelCard from "@payfunc/model-card"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"
import { post } from "./post"

export async function create(
	connection: cli.Connection,
	order: payfunc.Order.Creatable,
	auto3d?: boolean
): Promise<authly.Token | gracely.Error> {
	let result: authly.Token | gracely.Error | undefined
	let card: authly.Token | undefined
	result = await post(connection, order)
	let attempt = 0
	const merchant = await payfunc.Key.getVerifier().verify(connection.credentials?.keys.public, "public")
	while (
		cli.Verification.Error.is(result) &&
		auto3d &&
		payfunc.Payment.Card.Creatable.is(order.payment) &&
		order.payment.card &&
		attempt < 4
	) {
		card = await cli.Verification.get(result, merchant as modelCard.Merchant, order.payment.card)
		if (card) {
			order.payment.card = card
			result = await post(connection, order)
		}
		attempt += 1
	}
	return result ? result : gracely.client.invalidContent("input", "couldn't create verifiable card payment")
}
export namespace create {
	export const command: paramly.Command<cli.Connection> = {
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
						payment = (await modelCard.Authorization.verify(argument[1]))
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
