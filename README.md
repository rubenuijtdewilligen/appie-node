<img src="docs/appie-node-logo.png" alt="Logo" width="150"/>

# appie-node

A TypeScript-first Node.js client for the Albert Heijn API.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/appie-node.svg)](https://www.npmjs.com/package/appie-node)

## Installation

```bash
npm install appie-node
```

## Quick Start

### 1. Authentication

Before accessing user-specific data like receipts, authenticate via the OAuth2 flow.

```TypeScript
import { AppieClient } from "appie-node";

const appie = new AppieClient();
const loginUrl = appie.auth.createLoginUrl();

console.log("Visit to authenticate:", loginUrl);

// After authenticating in the browser, exchange the callback code for tokens:
const tokens = await appie.auth.exchangeToken("YOUR_AUTH_CODE");
appie.setToken(tokens.access_token);
```

### 2. Fetching Receipts

Retrieve recent in-store purchases and specific transaction details.

```TypeScript
import { AppieClient } from "appie-node";

const appie = new AppieClient("YOUR_ACCESS_TOKEN");

// Fetch the 10 most recent receipts
const receipts = await appie.receipts.getAll({ limit: 10 });
const latest = receipts[0];

// Fetch all lines of the latest receipt, containing items and discounts
const details = await appie.receipts.getById(latest.id);
console.log(details.products);
```

## Roadmap

Refer to [TODO.md](TODO.md) for the complete list of planned features.

## Acknowledgements

A special thanks to [gwillem/appie-go](https://github.com/gwillem/appie-go) for the inspiration and their work on reverse-engineering the Albert Heijn API.

## License

GPL 3.0 or later
