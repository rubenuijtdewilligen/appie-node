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
    console.log("Fetching receipts...");
    const receipts = await appie.receipts.getAll();
    const latestReceipt = receipts[0];

    if (!latestReceipt) {
      console.log("No receipts found.");
      return;
    }

    console.log(`${receipts.length} receipts found!`);
    console.log(
      `\nLatest purchase: ${latestReceipt.dateTime} (€${latestReceipt.totalAmount.amount})`,
    );

    console.log(`\nFetching details of the latest receipt...`);
    const details = await appie.receipts.getById(latestReceipt.id);

    const posIds = details.products.map((p) => p.id);

    console.log("Translating POS IDs to Webshop IDs...");
    const webshopMapping = await appie.products.convertPosIds(posIds);

    console.log("\nPurchased products:");
    details.products.forEach((product) => {
      const unitPrice = product.price
        ? ` (€${product.price.amount} per unit)`
        : "";
      const webshopId = webshopMapping[product.id];
      const webshopTag = webshopId
        ? `[Webshop ID: ${webshopId}]`
        : "[No webshop ID]";

      console.log(
        `- ${product.quantity}x ${product.name} | Total: €${product.amount.amount}${unitPrice} ${webshopTag}`,
      );
    });

    if (details.discounts.length > 0) {
      console.log("\nDiscounts:");
      details.discounts.forEach((discount) => {
        console.log(`- ${discount.name}: €${discount.amount.amount}`);
      });
    }
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
