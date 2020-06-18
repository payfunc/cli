import * as gracely from "gracely"
import * as authly from "authly"
import * as payfunc from "@payfunc/model"
import { Connection } from "../Connection"

export function post(connection: Connection, order: payfunc.Order.Creatable): Promise<authly.Token | gracely.Error> {
	return connection.postToken("public", "order", order)
}
