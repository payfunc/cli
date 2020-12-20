import * as gracely from "gracely"
import * as paramly from "paramly"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export async function cancel(connection: cli.Connection, id: string): Promise<payfunc.Event.Cancel | gracely.Error> {
	const event: Omit<payfunc.Event.Cancel, "date"> = { type: "cancel" }
	if (authly.Token.is(id))
		id = (await payfunc.Order.verify(id))?.id ?? id
	return connection.post<payfunc.Event.Cancel>("private", `order/${id}/event`, event)
}
export namespace cancel {
	export const command: paramly.Command<cli.Connection> = {
		name: "cancel",
		description: "Cancels order.",
		examples: [["<order id>", "Cancels order."]],
		execute: async (connection, argument, flags) => {
			const result = connection && (await cancel(connection, argument[0]))
			console.info(JSON.stringify(result, undefined, "\t"))
			return payfunc.Event.Cancel.is(result)
		},
	}
}
