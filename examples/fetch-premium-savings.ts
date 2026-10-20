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
    console.log("Fetching AH Premium savings...\n");
    const savings = await appie.loyalty.getPremiumSavings();

    if (!savings) {
      console.log(
        "No AH Premium savings found. Do you have an active Premium subscription?",
      );
      return;
    }

    console.log(`Subscription started: ${savings.subscriptionStartDate}`);
    console.log(`Last updated: ${savings.lastUpdated}\n`);

    console.log(
      `Total Amount Saved: €${savings.totalSavedAmount.amount.toFixed(2)}\n`,
    );

    console.log("Breakdown:");
    console.log(
      `- Biological Discount: €${savings.bioDiscountAmount.amount.toFixed(2)}`,
    );
    console.log(
      `- Terra (Plant-based) Discount: €${savings.terraDiscountAmount.amount.toFixed(2)}`,
    );
    console.log(
      `- Bonus Box Discount: €${savings.bonusBoxDiscountAmount.amount.toFixed(2)}`,
    );
    console.log(
      `- Premium Exclusive Bonus Box: €${savings.bonusBoxDiscountPremiumExclusiveAmount.amount.toFixed(2)}`,
    );
    console.log(
      `- Delivery Bundle Discount: €${savings.deliveryBundleDiscountAmount.amount.toFixed(2)}\n`,
    );

    console.log("Extra Points Gathered:");
    console.log(
      `- Additional Air Miles: ${savings.additionalAirmilesObtained}`,
    );
    console.log(`- Additional Stamps: ${savings.totalAdditionalStamps}`);
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
