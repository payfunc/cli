import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"

export type TestCommand = paramly.Command<cli.Connection> & {
	system: ("cloudflare" | "azure")[]
}
