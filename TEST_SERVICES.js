// Quick test script to check if services are running
// Run with: node TEST_SERVICES.js

import axios from "axios";

const services = [
  { name: "Gateway", url: "http://localhost:8000/api/ping" },
  {
    name: "Student Service",
    url: "http://localhost:5000/api/student/register",
  },
];

console.log("🔍 Testing services...\n");

for (const service of services) {
  try {
    const response = await axios.get(service.url, { timeout: 5000 });
    console.log(`✅ ${service.name}: Running`);
    console.log(`   Response: ${response.data}\n`);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log(`❌ ${service.name}: NOT RUNNING (Connection refused)`);
      console.log(`   Make sure ${service.name} is started\n`);
    } else if (error.code === "ETIMEDOUT") {
      console.log(`⏱️  ${service.name}: Timeout (may be running but slow)\n`);
    } else {
      console.log(`⚠️  ${service.name}: Error - ${error.message}\n`);
    }
  }
}

console.log("📝 Check the logs above to see which services are running.");
