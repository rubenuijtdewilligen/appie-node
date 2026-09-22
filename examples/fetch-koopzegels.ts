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
    console.log("Fetching Koopzegels balance...");
    const data = await appie.loyalty.getKoopzegelsBalance();
    const balance = data.purchaseStampBalance;

    console.log("\nBooklets & Points:");
    console.log(`- Full booklets: ${balance.points.fullBooklets}`);
    console.log(
      `- Stamps in current booklet: ${balance.points.currentBookletPoints} / 490`,
    );
    console.log(`- Total stamps collected: ${balance.points.totalPoints}`);

    console.log("\nFinancial Value:");
    console.log(`- Invested: €${balance.money.invested.amount.toFixed(2)}`);
    console.log(`- Interest: €${balance.money.interest.amount.toFixed(2)}`);
    console.log(
      `- Total payout value: €${balance.money.payout.amount.toFixed(2)}`,
    );

    if (balance.points.fullBooklets > 0) {
      console.log(
        `\nAvailable for immediate payout: €${(balance.points.fullBooklets * 52).toFixed(2)}`,
      );
    } else {
      console.log(`\nNo full booklets available for payout yet.`);
    }
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
