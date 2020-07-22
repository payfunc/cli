import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace card3dProblem {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "card-3d-problem",
		description: "Fails to create a card order with 3-D secure authentication failure response (40310).",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c = connection && await Card.create(connection, {
				pan: "420000403100000",
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
