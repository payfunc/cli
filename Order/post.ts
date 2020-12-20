import * as gracely from "gracely"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"

export function post(
	connection: cli.Connection,
	order: payfunc.Order.Creatable
): Promise<authly.Token | gracely.Error> {
	return connection.postToken("public", "order", order)
}
