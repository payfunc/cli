import * as gracely from "gracely"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"
import { TestCommand } from "./TestCommand"

export namespace cardCsc {
	export const command: TestCommand = {
		system: ["azure", "cloudflare"],
		name: "card-csc",
		description: "Fails to create a card order with the wrong CSC.",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c =
				connection &&
				(await Card.create(connection, {
					pan: "4111111111111111",
					expires: [2, 22],
					csc: "988",
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
			return gracely.client.malformedContent.is(error) && error.content.property == "card.csc"
		},
	}
}
