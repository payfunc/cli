import * as gracely from "gracely"
import * as paramly from "paramly"
import * as authly from "authly"
import * as modelCard from "@payfunc/model-card"
import * as payfunc from "@payfunc/model"
import * as cli from "@payfunc/cli-card"
import { post } from "./post"

export async function create(
	connection: cli.Connection,
	account: payfunc.Account.Creatable,
	auto3d?: boolean
): Promise<payfunc.Account | gracely.Error> {
	let result: payfunc.Account | authly.Token | gracely.Error | undefined
	let card: authly.Token | undefined
	result = await post(connection, account)
	let attempt = 0
	const merchant = await payfunc.Key.getVerifier().verify(connection.credentials?.keys.public, "public")
	while (
		cli.Verification.Error.is(result) &&
		auto3d &&
		account.method.length > 0 &&
		payfunc.Account.Method.Card.Creatable.Token.is(account.method[account.method.length - 1]) &&
		account.method[account.method.length - 1].card &&
		attempt < 4
	) {
		card = account.method[account.method.length - 1].card
		card = card ? await cli.Verification.get(result, merchant as modelCard.Merchant, card) : undefined
		if (card) {
			account.method[account.method.length - 1].card = card
			result = await post(connection, account)
		}
		attempt += 1
	}
	return result ? result : gracely.client.invalidContent("input", "couldn't create verifiable card payment")
}
export namespace create {
	export const command: paramly.Command<cli.Connection> = {
		name: "create",
		description: "Create a account.",
		examples: [
			["card <authorization token> 13.37 EUR", "Create account using authorization token."],
			["card <card token> 13.37 EUR", "Create account using card token."],
			[
				"card auto <card token> 13.37 EUR",
				"Create account using card token automatically do 3D secure (only testing).",
			],
		],
		execute: async (connection, argument, flags) => {
			const account = argument[0]
			const auto = argument[1] == "auto"
			if (auto)
				argument.splice(1, 1)
			const result = connection && payfunc.Account.Creatable.is(account) && (await create(connection, account, auto))
			console.info("\n" + (typeof result == "string" ? result : JSON.stringify(result, undefined, "\t")))
			return payfunc.Account.is(result)
		},
	}
}
