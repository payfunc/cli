# PayFunc CLI
Command line interface for CardFunc.

# Installing
Install using NPM in the global scope:
```
npm install -g @payfunc/cli
```

# Usage
Assuming that the `payfunc` command is installed in your path as done above.
## Version
To learn which version you have installed use:
```
cardfunc version
```
## Help 
### List Modules
To get an index of all help commands:
```
payfunc help
```
### Module Help
Help for a specific module can be gotten by:
```
payfunc help <module>
```
### Command Help
```
payfunc help <module> <command>
```
## Server
### Add Server
#### Adding a Server
```
payfunc server add <name> <private key> <public key>
```
#### With Admin User and Password
```
payfunc server add <name> <private key> <public key> <admin> <password>
```
#### Storage
Added servers are stored in the `~/.payfunc` directory in cleartext.

### List Server
```
payfunc server list
```
### Using Server
To use a particular server use the `--server` flag:
```
payfunc --server <server name> <module> <command> <...arguments>
```
### Default Server
The server with the name `default` is used by default when no `--server` flag is used.

### Env Server
The server name `env` is reserved and when used the following enviroment variables are used for server credentials:
- `privateKey`
- `publicKey`
-	`adminUser`
- `adminPassword`

### URL Override
To override the URL used to connect to the server use the `--url` flag:
```
payfunc --url <url> <module> <command> <...arguments>
```
