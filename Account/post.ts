import * as gracely from "gracely"
import * as authly from "authly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"

export function post(
	connection: cli.Connection,
	account: payfunc.Account.Creatable
): Promise<payfunc.Account | gracely.Error> {
	return connection.post("public", "account", account)
}
