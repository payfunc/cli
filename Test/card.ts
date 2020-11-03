import * as authly from "authly"
import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace card {
	export const command: paramly.Command<cli.Connection> = {
		name: "card",
		description: "Creates a card order, charges and refunds it.",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c =
				connection &&
				(await Card.create(connection, {
					pan: "4111111111111111",
					expires: [2, 22],
					csc: "987",
				}))
			const creatable = authly.Token.is(c) && {
				items: 13.37,
				currency: "SEK",
				payment: {
					type: "card",
					card: c,
				},
			}
			const token =
				connection && payfunc.Order.Creatable.is(creatable) && (await Order.create(connection, creatable, true))
			let result: boolean
			if ((result = authly.Token.is(token))) {
				const order = (await payfunc.Order.verify(token)) ?? undefined
				const charge = connection && token && (await Order.charge(connection, token))
				const refund = connection && token && (await Order.refund(connection, token))
				result =
					payfunc.Order.Creatable.is(creatable) &&
					payfunc.Order.is(order) &&
					payfunc.Event.Charge.is(charge) &&
					payfunc.Event.Refund.is(refund)
			}
			return result
		},
	}
}
