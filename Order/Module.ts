import { Module } from "../Module"
import { Command } from "../Command"

const commands: { [command: string]: Command } = {}

export function addCommand(command: Command) {
	commands[command.name] = command
}

Module.register({
	name: "order",
	description: "Create order.",
	commands,
}, "order", "o")
