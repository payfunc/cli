import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export function post(
	connection: cardfunc.Connection,
	account: payfunc.Account.Creatable
): Promise<payfunc.Account | gracely.Error> {
	return connection.post("public", "account", account)
}
