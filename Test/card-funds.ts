import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace cardFunds {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "card-funds",
		description: "Fails to create a card order with insufficient funds response (40413).",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c = connection && await Card.create(connection, {
				pan: "420000401400000",
				expires: [ 2, 22 ],
				csc: "987",
			})
			const creatable = authly.Token.is(c) && {
				items: 13.37,
				currency: "SEK",
				payment: {
					type: "card",
					card: c,
				},
			}
			const error = connection && payfunc.Order.Creatable.is(creatable) && await Order.create(connection, creatable, true)
			return gracely.client.malformedContent.is(error) &&
				error.content.property == "card.pan" &&
				error.content.description == "Invalid card number."
		}
	}
}
