#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import { application } from "./application"
import "./Server"
import "./Merchant"
import "./Order"

application.run(process.argv).then(result => process.exit(result ? 0 : 1), _ => process.exit(1));
