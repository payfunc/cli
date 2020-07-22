import * as authly from "authly"
import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function convert(connection: cardfunc.Connection): Promise<cardfunc.Connection | undefined> {
	const payfuncPublic = await authly.Verifier.create("public").verify(connection?.credentials?.keys.public)
	const cardfuncKey = payfunc.Merchant.V1.Key.is(payfuncPublic) && typeof payfuncPublic.option.card == "string" && await authly.Verifier.create("public").verify(payfuncPublic.option.card)
	return (cardfuncKey && await connection.change({ url: cardfuncKey.iss })) || undefined
}
