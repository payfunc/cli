import * as gracely from "gracely"
import * as authly from "authly"
import * as modelCard from "@payfunc/model-card"
import * as cli from "@cardfunc/cli"
import * as Connection from "./Connection"

export async function create(
	connection: cli.Connection,
	card: modelCard.Card.Creatable
): Promise<authly.Token | gracely.Error> {
	const c = await Connection.convert(connection)
	return c ? cli.Card.create(c, card) : gracely.client.notFound()
}
