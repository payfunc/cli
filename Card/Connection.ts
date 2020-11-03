import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"

export async function convert(connection: cli.Connection): Promise<cli.Connection | undefined> {
	const payfuncPublic = connection?.credentials?.keys.public
		? await payfunc.Key.unpack(connection?.credentials?.keys.public, "public")
		: undefined
	return (payfuncPublic && (await connection.change({ url: payfuncPublic?.card?.url }))) || undefined
}
