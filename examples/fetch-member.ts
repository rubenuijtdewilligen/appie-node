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
    console.log("Fetching member profile...\n");
    const profile = await appie.member.getProfile();

    if (profile.name) {
      console.log(`Hello, ${profile.name.first} ${profile.name.last}!`);
    } else {
      console.log(`Hello, AH Member (ID: ${profile.id})!`);
    }
  } catch (error) {
    console.error("\nError:", error);
  }
}

runExample();
