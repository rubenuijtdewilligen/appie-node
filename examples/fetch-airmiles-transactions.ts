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
    console.log("Fetching Air Miles transactions...\n");
    const transactions = await appie.loyalty.getAirMilesTransactions();

    if (transactions.length === 0) {
      console.log("No transactions found.");
      return;
    }

    transactions.forEach((t) => {
      // Zorg voor een + teken bij positieve bedragen
      const valueStr = t.value > 0 ? `+${t.value}` : `${t.value}`;

      console.log(`- ${t.date} | ${t.domain}`);
      console.log(`  ${t.description}`);
      console.log(`  Mutation: ${valueStr} Miles`);
      console.log("  ---");
    });
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
