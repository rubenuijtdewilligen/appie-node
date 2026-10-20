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
    console.log("Searching for 'kaas' (vegetarian, Nutri-Score A)...");
    const result = await appie.products.searchProducts({
      query: "kaas",
      sortType: "RELEVANCE",
      page: { number: 0, size: 10 },
      facets: [
        { label: "product.properties.nutri-score", values: { values: ["a"] } },
        { label: "product.properties.dieet", values: { values: ["vegetarisch"] } },
      ],
    });

    console.log(`Found ${result.totalFound} products. First results:\n`);
    result.products.slice(0, 10).forEach((product) => {
      const price = product.priceV2?.now?.amount ?? "?";
      const was = product.priceV2?.was?.amount;
      const wasText = was ? ` (was €${was})` : "";
      console.log(`- ${product.title} | €${price}${wasText}`);
    });

    const brands = result.facets?.facets?.find(
      (facet) => facet.name === "product.brand.name",
    );
    if (brands) {
      console.log(`\nAvailable brand facet options:`);
      brands.options?.slice(0, 10).forEach((option) => {
        console.log(`- ${option.name} (${option.matches} matches)`);
      });
    }
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
