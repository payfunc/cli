import * as gracely from "gracely"
import * as authly from "authly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export function post(connection: cardfunc.Connection, order: payfunc.Order.Creatable): Promise<authly.Token | gracely.Error> {
	return connection.postToken("public", "order", order)
}
