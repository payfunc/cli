import * as gracely from "gracely"
import * as paramly from "paramly"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function charge(
	connection: cli.Connection,
	id: string | authly.Token,
	amount?: number
): Promise<payfunc.Event.Charge | gracely.Error> {
	const event: Omit<payfunc.Event.Charge, "date"> = { type: "charge" }
	if (authly.Token.is(id))
		id = (await payfunc.Order.verify(id))?.id ?? id
	if (amount != undefined)
		event.items = amount
	return connection.post<payfunc.Event.Charge>("private", `order/${id}/event`, event)
}
export namespace charge {
	export const command: paramly.Command<cli.Connection> = {
		name: "charge",
		description: "Charges order.",
		examples: [
			["<order id>", "Charges order."],
			["<order id> <amount>", "Charges amount of order."],
		],
		execute: async (connection, argument, flags) => {
			const amount = Number.parseFloat(argument[1])
			const result = connection && (await charge(connection, argument[0], amount))
			console.info(JSON.stringify(result, undefined, "\t"))
			return payfunc.Event.Charge.is(result)
		},
	}
}
