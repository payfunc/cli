import * as cli from "@payfunc/cli-card"
import * as Merchant from "./Merchant"
import * as Agent from "./Agent"
import * as Order from "./Order"
import * as Test from "./Test"

type Connection = cli.Connection
const Connection = cli.Connection
const Server = cli.Server

export { Connection, Merchant, Order, Server, Test, Agent }
