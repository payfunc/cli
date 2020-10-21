import * as cardfunc from "@cardfunc/cli"
import * as payfunc from "@payfunc/model"

export async function convert(connection: cardfunc.Connection): Promise<cardfunc.Connection | undefined> {
	const payfuncPublic = connection?.credentials?.keys.public
		? await payfunc.Key.unpack(connection?.credentials?.keys.public, "public")
		: undefined
	return (payfuncPublic && (await connection.change({ url: payfuncPublic?.card?.url }))) || undefined
}
