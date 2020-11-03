import * as authly from "authly"
import * as paramly from "paramly"
import * as cli from "@payfunc/cli-card"
import * as payfunc from "@payfunc/model"
import * as Order from "../Order"

export namespace cardOldAccount {
	export const command: paramly.Command<cli.Connection> = {
		name: "card-old-account",
		description:
			"Creates a card order with an old account (with reference to a @payfunc/model-card.Account), charges and refunds it.",
		examples: [],
		execute: async (connection, argument, flags) => {
			// This test will fail locally. This is a legacy test with a token that isn't possible to create anymore (but may still be used by old merchants). If cardfunc card (testtest user) with id: "wLSTzEra" is removed this test will fail on all servers.
			const accountToken =
				"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYXlmdW5jIiwiaWF0IjoxNjAwNzc5NTg4NzM2LCJhdWQiOiJwcm9kdWN0aW9uIiwicmVmZXJlbmNlIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKRFlYSmtSblZ1WXlJc0ltbGhkQ0k2TVRZd01EYzNNemt6TnpjM01Dd2lZWFZrSWpvaWNISnZaSFZqZEdsdmJpSXNJbWxrSWpvaWQweFRWSHBGY21FaWZRLlRNNm53c3c2ckp6aVpFMEVWZ0xzZlJNbFNqZ1BCMmZOcDlySUVLbUw5YU1oWHZ2bFR2X0J2T3NhQlFtMzVndHk4WEU2MGphWjNzQW9GUjNCVUI3dC1BeXY3LXV5WE91VU54YUF5V21IUVZWTC1BdnJFWkJBOEFISXRsUkJhOU9TdzZhd3pVYjZkaFExVkx4Z0d5RVdrQ2dHMjZNSm8xTzlKYzd2a1FhOVg0b3Bveml4UUdZS1RCOFJHam9PYlhKY1B0ektQb0xoUE5CNlZpNFBvaEFQMEdEMnpyZ19uY2t6U2FmZHAzRWNDa1dfMXNoMHVEWG05TWNsN3BQallNNG1meDFwSTR0NDB0MzVBMFVEYlVNRXJPcTUwVXBpV0hYcWFsWE9rOEV1akNTTGpkNnpkZlpRUXozeERhbGE0R045WXpidlhTajZTMkVKTWNJY2pHZTctQSIsInR5cGUiOiJjYXJkIiwic2NoZW1lIjoidmlzYSIsImlpbiI6IjQxMTExMSIsImxhc3Q0IjoiMTExMSIsImV4cGlyZXMiOlsyLDIyXSwiY3JlYXRlZCI6IjIwMjAtMDktMjJUMTI6NTk6NDguNjY5WiJ9.q0urLPlkr84tLvBJsPze2Nb1mLcJ6qgOHrNBXveFZlXDWeKTU0XoxTN5uRBWWq8RvCysCiVTaBVznPfpKvrNQGLPGBxRo0y-xEx2ZLTMuJnMsqco-tNA8seO9HwAY5QOapIcSAlZqcNvHrEOWg62hXhrnUWZgAmgVrpgg5bQtp_ZH5SVdZdazB-1fZAMpChJkkyDJLDhO-T7ilNpDHV-AeUYs-WH6ulITIqGWF1tse4bRMYtoAIEjZHitr5PD6mx2KuQ1J4k0wyU1LjXacph6oXivdunEU3x7FytGhlQEZ-EbY4KMfskmRFaWnZiYcuF8bXc3woj4MnT2OQNm6xkBQ"
			const creatable = {
				items: 13.37,
				currency: "SEK",
				payment: {
					type: "account",
					token: accountToken,
				},
			}
			const token =
				connection && payfunc.Order.Creatable.is(creatable) && (await Order.create(connection, creatable, true))
			let result: boolean
			if ((result = authly.Token.is(token))) {
				const order = (await payfunc.Order.verify(token)) ?? undefined
				const charge = connection && token && (await Order.charge(connection, token))
				const refund = connection && token && (await Order.refund(connection, token))
				result =
					payfunc.Order.Creatable.is(creatable) &&
					payfunc.Order.is(order) &&
					payfunc.Event.Charge.is(charge) &&
					payfunc.Event.Refund.is(refund)
			}
			return result
		},
	}
}
