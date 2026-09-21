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
    const testIds = [374019, 387770, 230741];

    console.log(`Fetching data for ${testIds.length} products...\n`);
    const products = await appie.products.getMultiple(testIds);

    if (products.length === 0) {
      console.log("No products found.");
      return;
    }

    console.log("Products:");
    products.forEach((p) => {
      console.log(`- ${p.title} (${p.brand || "No brand"})`);
      console.log(`  Category:    ${p.mainCategory} > ${p.subCategory}`);
      console.log(`  Nutri-Score: ${p.nutriscore || "None"}`);
      console.log(`  Properties:  ${p.propertyIcons?.join(", ") || "None"}`);
      console.log("  ---");
    });
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
