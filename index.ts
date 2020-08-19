import * as cardfunc from "@cardfunc/cli"
import * as Merchant from "./Merchant"
import * as Order from "./Order"
import * as Test from "./Test"

type Connection = cardfunc.Connection
const Connection = cardfunc.Connection
const Server = cardfunc.Server

export { Connection, Merchant, Order, Server, Test }
