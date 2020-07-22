import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import { card } from "./card"
import { card3dFail } from "./card-3d-fail"
import { card3dProblem } from "./card-3d-problem"
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
import { cardTransaction } from "./card-transaction"
import { cardUnsupported } from "./card-unsupported"
import { cardViolation } from "./card-violation"

const testModule: paramly.Module<cardfunc.Connection> = {
	name: "order",
	description: "Create order.",
	commands: {
		card: card.command,
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
			name: "_",
			description: "Runs tests.",
			examples: [["", "Invoke all tests."]],
			execute: async (connection, argument, flags) => {
				console.info("PayFunc Test\n")
				const result = (await Promise.all(Object.values(testModule.commands).filter(c => c?.name != "_").map(async c => {
					const r = await c?.execute(connection, argument, flags)
					console.info(c?.name.padEnd(20, ".") + (r ? "ok" : "fail").padStart(4, "."))
					return !!r
				}))).every(r => r)
				console.info()
				return result
			}
		}
	},
}

export {
	card,
	cardCancel,
	cardCsc,
	cardCurrency,
	testModule as module,
}
