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
    const webshopId = 374019;
    console.log(`Fetching deep details for webshop ID: ${webshopId}...`);

    const detail = await appie.products.getDetail(webshopId);
    console.log(`\nProduct: ${detail.productCard.title}`);

    if (detail.productCard.descriptionHighlights) {
      console.log("\nDescription (HTML):");
      console.log(detail.productCard.descriptionHighlights);
    }

    const tradeItem = detail.tradeItem;
    if (tradeItem) {
      console.log("\nProduct Data:");
      if (tradeItem.foodAndBeverageIngredientStatement) {
        console.log(
          `- Ingredients: ${tradeItem.foodAndBeverageIngredientStatement}`,
        );
      }
      if (tradeItem.consumerInstructions?.storageInstructions) {
        console.log(
          `- Storage instructions: ${tradeItem.consumerInstructions.storageInstructions.join(", ")}`,
        );
      }
    }

    console.log("\nFetching nutrition data...");
    const nutrients = await appie.products.getNutrition(webshopId);

    if (nutrients.length > 0) {
      console.log("\nNutritional Values:");
      nutrients.forEach((n) => {
        console.log(`- ${n.name.padEnd(20, " ")}: ${n.value}`);
      });
    } else {
      console.log("No nutritional values found.");
    }
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
