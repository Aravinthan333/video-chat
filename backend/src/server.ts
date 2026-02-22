import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: "./.env.dev" });
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.get("/abc", (req, res) => {
  console.log("Working Fine!");
  res.send("Working Fine!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

app.get("/users", async (req, res) => {
  try {
    console.log("inside users");
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening!");
});

// const createUser = async() => {
//     await Prisma.user.create({
//         data:{
//             name:"John Doe",
//             email:"[EMAIL_ADDRESS]",
//             password:"password"
//         }
//     })
// }
