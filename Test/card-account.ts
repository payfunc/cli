import * as authly from "authly"
import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"
import * as Account from "../Account"
import * as Order from "../Order"
import * as Card from "../Card"

export namespace cardAccount {
	export const command: paramly.Command<cli.Connection> = {
		name: "card-account",
		description:
			"Creates a card order with an old account (with reference to a @payfunc/model-card.Account), charges and refunds it.",
		examples: [],
		execute: async (connection, argument, flags) => {
			let result: boolean
			const cardfuncConnecton = connection ? await Card.Connection.convert(connection) : undefined
			const c =
				cardfuncConnecton &&
				(await Card.create(cardfuncConnecton, {
					pan: "4111111111111111",
					expires: [9, 99],
					csc: "987",
				}))
			if (!c || gracely.Error.is(c))
				result = false
			else {
				const account =
					connection &&
					(await Account.create(
						connection,
						{
							number: "payfunc-new-account-create-test",
							method: [
								{
									type: "token",
									card: c,
								},
							],
						},
						true
					))
				const creatable = payfunc.Account.is(account) &&
					authly.Token.is(account.method[account.method.length - 1].token) && {
						items: 13.37,
						currency: "SEK",
						payment: {
							type: "account",
							token: account.method[account.method.length - 1].token,
						},
					}
				const token = connection && payfunc.Order.Creatable.is(creatable) && (await Order.create(connection, creatable))
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
			}
			return result
		},
	}
}
