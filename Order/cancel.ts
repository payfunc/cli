import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function cancel(connection: cardfunc.Connection, id: string): Promise<payfunc.Event.Cancel | gracely.Error> {
	const event: Omit<payfunc.Event.Cancel, "date"> = { type: "cancel" }
	if (authly.Token.is(id))
		id = (await payfunc.Order.verify(id))?.id ?? id
	return connection.post<payfunc.Event.Cancel>("private", `order/${ id }/event`, event)
}
export namespace cancel {
	export const command: paramly.Command<cardfunc.Connection> = {
		name: "cancel",
		description: "Cancels order.",
		examples: [
			["<order id>", "Cancels order."],
		],
		execute: async (connection, argument, flags) => {
			const result = connection &&
				await cancel(connection, argument[0])
			console.info(JSON.stringify(result, undefined, "\t"))
			return payfunc.Event.Cancel.is(result)
		}
	}
}
