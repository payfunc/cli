import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import * as Order from "../Order"
import { TestCommand } from "./TestCommand"

export namespace card3d2Extensive {
	export const command: TestCommand = {
		system: ["azure", "cloudflare"],
		name: "card-3d2-extensive",
		description:
			"Creates an extensive card order (with automated testing of 3D secure version 2), charges and refunds it.",
		examples: [],
		execute: async (connection, argument, flags) => {
			const c =
				connection &&
				(await Card.create(connection, {
					pan: "4111111111111111",
					expires: [2, 33],
					csc: "987",
				}))
			const creatable: payfunc.Order.Creatable | undefined = authly.Token.is(c)
				? {
						items: [
							{
								number: "Item A",
								price: 1345.67,
								vat: 333.33,
								rebate: 100,
								quantity: 2,
							},
							{
								number: "Item B",
								price: 134.5,
								vat: 33.33,
								rebate: 0,
								quantity: 1,
							},
						],
						customer: {
							type: "person",
							identityNumber: "198411136115",
							id: "1234",
							number: "abcd1234",
							name: {
								first: "Adam",
								last: "Person",
							},
							address: {
								primary: {
									street: "Street road 1",
									city: "Exampleville",
									zipCode: "12345",
									countryCode: "SE",
								},
								billing: {
									street: "Street road 2",
									city: "Example2ville",
									zipCode: "23456",
									countryCode: "FI",
								},
								delivery: {
									street: "Street road 3",
									city: "Example3ville",
									zipCode: "34567",
									countryCode: "DE",
									state: "Bayern",
								},
							},
							email: {
								primary: "example1@mail.com",
								billing: "example2@mail.com",
							},
							phone: {
								primary: "+46701234567",
								cellphone: "070 123 45 67",
								landline: "0701234567",
							},
						},
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
