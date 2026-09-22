import { AppieClient } from "../src/index.js";
import * as fs from "fs";

const AUTH_FILE = ".appie-auth.json";

async function runExample() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error("No tokens found. First run: npx tsx examples/login-flow.ts");
    return;
  }

  const authData = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
  const appie = new AppieClient(authData.access_token);

  try {
    console.log("Fetching Air Miles balance...\n");
    const balance = await appie.loyalty.getAirMilesBalance();

    console.log(`Total Air Miles: ${balance}`);
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
