import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace cardExpired {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "card-expired",
		description: "Fails to create a card order with invalid expire date response (40130).",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c = connection && await Card.create(connection, {
				pan: "4111111111111111",
				expires: [ 2, 20 ],
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
				error.content.description == "Card expired"
		}
	}
}
