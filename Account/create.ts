import * as gracely from "gracely"
import * as authly from "authly"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"
import * as Card from "../Card"
import { post } from "./post"

export async function create(
	connection: cardfunc.Connection,
	account: payfunc.Account.Creatable,
	auto3d?: boolean
): Promise<payfunc.Account | gracely.Error> {
	let result: payfunc.Account | gracely.Error
	const response = await post(connection, account)
	let pareq: string | undefined
	if (
		auto3d &&
		account.method.length > 0 &&
		payfunc.Account.Method.Card.Creatable.Token.is(account.method[account.method.length - 1]) &&
		account.method[account.method.length - 1].card &&
		payfunc.PaymentVerifier.Response.VerificationRequired.isCardVerificationError(response) &&
		(pareq = response.content.details.data?.pareq || response.content.details.data?.PaReq)
	) {
		const pares = await cardfunc.Pares.get({ url: response.content.details.url, pareq })
		const methodCard = account.method[account.method.length - 1].card
		const card =
			pares && methodCard
				? await Card.update(connection, methodCard, {
						verification: { type: "pares", data: pares },
				  })
				: gracely.server.backendFailure("Failed to get pares")
		if (gracely.Error.is(card))
			result = card
		else {
			account.method[account.method.length - 1].card = card
			result = await post(connection, account)
		}
	} else
		result = response
	return result
}
export namespace create {
	export const command: paramly.Command<cardfunc.Connection> = {
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
