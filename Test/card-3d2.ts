import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"
import { TestCommand } from "./TestCommand"

export namespace card3d2 {
	export const command: TestCommand = {
		system: ["azure", "cloudflare"],
		name: "card-3d2",
		description: "Creates a card order (with automated testing of 3D secure version 2), charges and refunds it.",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c =
				connection &&
				(await Card.create(connection, {
					pan: "4111111111111111",
					expires: [2, 22],
					csc: "987",
				}))
			const creatable: payfunc.Order.Creatable | undefined = authly.Token.is(c)
				? {
						items: 1300.37,
						currency: "SEK",
						payment: {
							type: "card",
							card: c,
							client: {
								browser: {
									colorDepth: 24,
									java: false,
									javascript: true,
									locale: "sv-SE",
									parent: "http://localhost",
									resolution: [2560, 1440],
									timezone: -60,
								},
							},
						},
				  }
				: undefined
			const token =
				connection && payfunc.Order.Creatable.is(creatable)
					? await Order.create(connection, creatable, true)
					: undefined
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
