#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import * as paramly from "paramly"
import * as cli from "./index"
import * as configuration from "./package.json"

export const application = new paramly.Application(
	"PayFunc CLI",
	"payfunc",
	configuration.version,
	[
		{
			short: "s",
			long: "server",
			arguments: 1,
			description: "Use diffrent server than default.",
			usage: "<server name>",
		},
		{
			short: "u",
			long: "url",
			arguments: 1,
			description: "Use diffrent url than default.",
			usage: "<url>",
		},
	],
	async f => cli.Connection.create("payfunc", (f.s ?? f.server)?.[0] ?? "default", (f.u ?? f.url)?.[0])
)
application.register(cli.Merchant.module, "merchant", "m")
application.register(cli.Agent.module, "agent", "ag")
application.register(cli.Order.module, "order", "o")
application.register(cli.Server.module, "server", "s")
application.register(cli.Test.module, "test", "t")

application.run(process.argv).then(
	result => process.exit(result ? 0 : 1),
	_ => process.exit(1)
)
