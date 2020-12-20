import * as gracely from "gracely"
import * as paramly from "paramly"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"
import * as Card from "../Card"
import * as Order from "../Order"

export namespace cardViolation {
	export const command: paramly.Command<cli.Connection> = {
		name: "card-violation",
		description: "Fails to create a card order with acquirer rule violation response (40200).",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c =
				connection &&
				(await Card.create(connection, {
					pan: "420000401400000",
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
			const error =
				connection && payfunc.Order.Creatable.is(creatable) && (await Order.create(connection, creatable, true))
			return (
				gracely.client.malformedContent.is(error) &&
				error.content.property == "card.pan" &&
				error.content.description == "Invalid card number."
			)
		},
	}
}
