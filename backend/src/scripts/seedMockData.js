import mongoose from "mongoose";
import dotenv from "dotenv";
import MockCompany from "../models/MockCompany.model.js";
import MockIdentity from "../models/MockIdentity.model.js";

dotenv.config();

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (len) => Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, "0");
const getRandomChar = (len) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Rohan", "Anjali", "Karan", "Pooja", "Siddharth", "Kavita"];
const lastNames = ["Sharma", "Patil", "Deshmukh", "Joshi", "Kumar", "Singh", "Gupta", "Verma", "Rao", "Das", "Bochare", "Kadam"];
const companyNouns = ["Tech", "Global", "Future", "Smart", "Apex", "Nexus", "Pioneer", "Dynamic", "Vision", "Prime"];
const companySuffixes = ["Solutions", "Industries", "Enterprises", "Traders", "Innovations", "Corp", "Logistics", "Ventures"];
const bankDetails = [
  { name: "HDFC Bank", ifscPrefix: "HDFC" },
  { name: "SBI", ifscPrefix: "SBIN" },
  { name: "ICICI Bank", ifscPrefix: "ICIC" },
  { name: "Axis Bank", ifscPrefix: "UTIB" },
  { name: "Kotak Mahindra", ifscPrefix: "KKBK" }
];
const companyTypes = ["Private Limited", "LLP", "Proprietorship", "Public Limited"];
const industryTypes = ["Textiles", "IT", "Manufacturing", "Agriculture", "Logistics", "Retail", "Pharmaceuticals"];

const generatePan = () => getRandomChar(5) + getRandomNum(4) + getRandomChar(1);
const generateGstin = (pan) => "27" + pan + "1Z" + getRandomChar(1);

const seedDatabase = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL); 
    console.log("✅ MongoDB Connected!");

    console.log("🧹 Clearing old mock data...");
    await MockCompany.deleteMany({});
    await MockIdentity.deleteMany({});

    const mockCompanies = [];
    const mockIdentities = [];

    for (let i = 0; i < 50; i++) {
      // 1. Generate Identity
      const pan = generatePan();
      const bank = getRandomItem(bankDetails);
      
      mockIdentities.push({
        name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
        aadhaarNo: getRandomNum(12),
        panNo: pan,
        accounts: [{
          accountNumber: getRandomNum(12),
          ifscCode: `${bank.ifscPrefix}000${getRandomNum(4)}`,
          bankName: bank.name
        }]
      });

      // 2. Generate Company (Now with unique email!)
      const noun = getRandomItem(companyNouns);
      const suffix = getRandomItem(companySuffixes);
      const cType = getRandomItem(companyTypes);
      const companyPan = generatePan(); 
      
      // Clean up the name for the email domain (e.g., "techsolutions")
      const domainName = `${noun.toLowerCase()}${suffix.toLowerCase()}`;
      // Add the index 'i' to guarantee 100% uniqueness
      const uniqueEmail = `admin${i}@${domainName}.in`;

      mockCompanies.push({
        companyName: `${noun} ${suffix} ${cType}`,
        email: uniqueEmail, // 👈 New field added!
        gstin: generateGstin(companyPan),
        companyType: cType,
        industryType: getRandomItem(industryTypes),
        turnover: Math.floor(Math.random() * 50000000) + 1000000 
      });
    }

    console.log("🌱 Injecting 50 Mock Identities and 50 Mock Companies...");
    await MockIdentity.insertMany(mockIdentities);
    await MockCompany.insertMany(mockCompanies);

    console.log("🎉 Success! Database seeded completely.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();