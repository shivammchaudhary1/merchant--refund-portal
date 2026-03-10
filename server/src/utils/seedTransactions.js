import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../../dist/models/transaction.model.js";
import { envs } from "../../dist/config/environments/envs.js";

async function seedTransactions() {
  try {
    await mongoose.connect(envs.MONGO_URI);
    console.log("Connected to MongoDB");

    const merchantId = "69afe933220f23bb90be32ae";

    function randomStatus() {
      const r = Math.random();

      if (r < 0.7) return "Successful"; // 70%
      if (r < 0.9) return "Processing"; // 20%
      return "Failed"; // 10%
    }

    function randomISTDate() {
      const months = [0, 1, 2]; // Jan Feb Mar
      const month = months[Math.floor(Math.random() * months.length)];

      const day = Math.floor(Math.random() * 28) + 1;
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);

      // IST offset (+5:30)
      return new Date(Date.UTC(2026, month, day, hour - 5, minute - 30));
    }

    function generateTimeline(status, baseDate) {
      const initiated = new Date(baseDate);
      initiated.setMinutes(initiated.getMinutes() - 5);

      const processing = new Date(baseDate);
      processing.setMinutes(processing.getMinutes() - 2);

      const timeline = [
        { status: "Initiated", updatedAt: initiated },
        { status: "Processing", updatedAt: processing },
      ];

      timeline.push({
        status,
        updatedAt: baseDate,
      });

      return timeline;
    }

    const transactions = [];

    for (let i = 0; i < 50; i++) {
      const status = randomStatus();
      const date = randomISTDate();

      transactions.push({
        merchantId,
        transactionId: uuidv4(),
        amount: faker.number.int({ min: 1000, max: 50000 }),
        status,
        transactionDate: date,
        statusTimeline: generateTimeline(status, date),
      });
    }

    await Transaction.insertMany(transactions);
    console.log("50 transactions inserted successfully");
  } catch (error) {
    console.error("Error seeding transactions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit();
  }
}

// Run the seeding function
seedTransactions();
