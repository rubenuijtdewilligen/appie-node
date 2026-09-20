import { AppieClient } from "../src/index.js";
import * as readline from "readline";
import * as fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const AUTH_FILE = ".appie-auth.json";

async function runLogin() {
  const appie = new AppieClient();
  const loginUrl = appie.auth.createLoginUrl();

  console.log("1. Open this link in your browser:");
  console.log(`\n${loginUrl}\n`);

  rl.question("2. Paste your auth code here: ", async (code) => {
    try {
      console.log("\nFetching tokens...");
      const tokens = await appie.auth.exchangeToken(code.trim());

      fs.writeFileSync(AUTH_FILE, JSON.stringify(tokens, null, 2));
      console.log(`✅ Success! Tokens safely saved in ${AUTH_FILE}.`);
      console.log(
        `You can now run the other examples without logging in again!`,
      );
    } catch (error) {
      console.error("❌ Error logging in:", error);
    } finally {
      rl.close();
    }
  });
}

runLogin();
