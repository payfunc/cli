import * as gracely from "gracely"
import * as authly from "authly"
import * as modelCard from "@payfunc/model-card"
import * as cli from "@payfunc/cli-card"
import * as Connection from "./Connection"

export async function update(
	connection: cli.Connection,
	token: authly.Token,
	card: Partial<modelCard.Card.Creatable>
): Promise<authly.Token | gracely.Error> {
	const c = await Connection.convert(connection)
	return c ? cli.Card.update(c, token, card) : gracely.client.notFound()
}
