import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace cardCancel {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "card-cancel",
		description: "Creates a card order and cancels it.",
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
				const cancel = connection && token && (await Order.cancel(connection, token))
				result = payfunc.Order.Creatable.is(creatable) && payfunc.Order.is(order) && payfunc.Event.Cancel.is(cancel)
			}
			return result
		},
	}
}
