import * as paramly from "paramly"
import * as authly from "authly"
import * as model from "@payfunc/model"
import * as cli from "@payfunc/cli-card"
import { card } from "./card"
import { card3dFail } from "./card-3d-fail"
import { card3dProblem } from "./card-3d-problem"
import { card3d2 } from "./card-3d2"
import { card3d2Extensive } from "./card-3d2-extensive"
import { cardAccount } from "./card-account"
import { cardBlocked } from "./card-blocked"
import { cardCancel } from "./card-cancel"
import { cardCsc } from "./card-csc"
import { cardCurrency } from "./card-currency"
import { cardDeclined } from "./card-declined"
import { cardDescription } from "./card-description"
import { cardError } from "./card-error"
import { cardExpired } from "./card-expired"
import { cardFraud } from "./card-fraud"
import { cardFunds } from "./card-funds"
import { cardInput } from "./card-input"
import { cardLimit } from "./card-limit"
import { cardOldAccount } from "./card-old-account"
import { cardTransaction } from "./card-transaction"
import { cardUnsupported } from "./card-unsupported"
import { cardViolation } from "./card-violation"
import { TestCommand } from "./TestCommand"

const testModule: paramly.Module<cli.Connection> & { commands: { [command: string]: TestCommand | undefined } } = {
	name: "order",
	description: "Create order.",
	commands: {
		card: card.command,
		"card-3d2": card3d2.command,
		"card-3d2-extensive": card3d2Extensive.command,
		"card-account": cardAccount.command,
		"card-old-account": cardOldAccount.command,
		"card-3d-fail": card3dFail.command,
		"card-3d-problem": card3dProblem.command,
		"card-blocked": cardBlocked.command,
		"card-cancel": cardCancel.command,
		"card-csc": cardCsc.command,
		"card-currency": cardCurrency.command,
		"card-declined": cardDeclined.command,
		"card-description": cardDescription.command,
		"card-error": cardError.command,
		"card-expired": cardExpired.command,
		"card-fraud": cardFraud.command,
		"card-funds": cardFunds.command,
		"card-input": cardInput.command,
		"card-limit": cardLimit.command,
		"card-transaction": cardTransaction.command,
		"card-unsupported": cardUnsupported.command,
		"card-violation": cardViolation.command,
		_: {
			system: ["azure", "cloudflare"],
			name: "_",
			description: "Runs tests.",
			examples: [["", "Invoke all tests."]],
			execute: async (connection, argument, flags) => {
				const system = await getSystemFromKey(connection?.credentials?.keys.public)
				console.info("PayFunc Test\n")
				const result = (
					await Promise.all(
						Object.values(testModule.commands)
							.filter(c => c?.name != "_")
							.filter(c => c?.system.some(s => s == system))
							.map(async c => {
								const r = await c?.execute(connection, argument, flags)
								console.info(c?.name.padEnd(20, ".") + (r ? "ok" : "fail").padStart(4, "."))
								return !!r
							})
					)
				).every(r => r)
				console.info()
				return result
			},
		},
	},
}

async function getSystemFromKey(key: authly.Token | undefined): Promise<"cloudflare" | "azure"> {
	const unpacked = key ? await model.Key.unpack(key) : undefined
	return unpacked?.card?.url.startsWith("https://api.payfunc")
		? "cloudflare"
		: unpacked?.card?.url.startsWith("https://api.cardfunc")
		? "azure"
		: unpacked?.card?.url.startsWith("http://localhost:7100")
		? "cloudflare"
		: "azure"
}

export { card, cardCancel, cardCsc, cardCurrency, testModule as module }
