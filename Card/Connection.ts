import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function convert(connection: cardfunc.Connection): Promise<cardfunc.Connection | undefined> {
	const payfuncPublic = await payfunc.Merchant.Key.KeyInfo.unpack(connection?.credentials?.keys.public, "public")
	return (payfuncPublic && (await connection.change({ url: payfuncPublic?.card?.url }))) || undefined
}
