import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function refund(
	connection: cardfunc.Connection,
	id: string,
	amount?: number
): Promise<payfunc.Event.Refund | gracely.Error> {
	const event: Omit<payfunc.Event.Refund, "date"> = { type: "refund" }
	if (authly.Token.is(id))
		id = (await payfunc.Order.verify(id))?.id ?? id
	if (amount != undefined)
		event.items = amount
	return connection.post<payfunc.Event.Refund>("private", `order/${id}/event`, event)
}
export namespace refund {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "refund",
		description: "Refunds order.",
		examples: [
			["<order id>", "Refunds order."],
			["<order id> <amount>", "Refunds partial amount of order."],
		],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection && (await refund(connection, argument[0], amount))
			console.info(JSON.stringify(result, undefined, "\t"))
			return payfunc.Event.Refund.is(result)
		},
	}
}
