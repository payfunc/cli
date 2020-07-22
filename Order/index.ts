import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/cli"
import { cancel } from "./cancel"
import { charge } from "./charge"
import { create } from "./create"
import { list } from "./list"
import { refund } from "./refund"
import { verify } from "./verify"

const orderModule: paramly.Module<cardfunc.Connection> = {
	name: "order",
	description: "Create order.",
	commands: {
		cancel: cancel.command,
		charge: charge.command,
		create: create.command,
		list: list.command,
		refund: refund.command,
		verify: verify.command,
	},
}

export {
	cancel,
	charge,
	create,
	list,
	refund,
	verify,
	orderModule as module,
}
