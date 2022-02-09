const express = require("express");
const app = express();
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const port = process.env.PORT || 5000;

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "doctor-portal-34e27",
    private_key_id: "6aa89753ff5e0344db0bec43a68a4684768b4221",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDM2UUZK+4mLLj0\nagcLRIJyK7fnnkj4RYeXRBmFgqO/ylSIPR85IZynj9BlbhQXfw4e3QTBmCo7fKK9\ncFTWvOLR9Ut8b2e6fNc5Tws+36aye24U/UeaBqP0htiFEo+dKh+xZfni+w2TZvpF\nDkjFL7KcS+NRfQQG6E2cbPb0IpNt8PXW6d6/NR4NVaoPaWXwiah7N/OGLFDMLxxm\ncAB5CbdGcw3eZGIsIui1M7PSYEMcgm+mlNYGExOBcjHHrkX6NRiEZrwiK7FuU5Oy\nLHWJuNSjbKH87IwLgAyxZK7IocoQR74lvm+wNZrNk4FvefHf6BdLw3vL852ZpVjx\nXfdZc52tAgMBAAECggEAMYOe6RuuP7n1ptZuB3Iy2afplumyl5gu0whZ5uSR8gzU\n6+1iO6v9Mp9XbvzxjFBguGMSAD1oj+Jrb8DUMOeNJ9TTvysqdnAwkaCihjsHDwM4\ns4gZI4jRXoytj1TSM9n3uSh+AzhNqsBsY/605jzGPnM1af/+1jCWeeX4t0AYRK1X\n8MYS93KHcF4gHNE+tjP7Ryyl/fE2x0Y7+BQJt1MTEKXvpCIQ10GMpvJl8WZlO+1i\nfpJYzEUB2lqN1CJQAwltU9ZpCpEUfa9xExTocyX2dsqDSFMU/sQ+KZnWzErmBTAL\n3To7eqLvPsAo+B3TMgRgjZvtHlydoDPv5nmp/3cTgQKBgQDrBfvtKkdLZeRWNW4P\nyp/9f6jVJYnQdY4mBE93n/LhpCNHxhkpLv+n/JH/kMDWE/RA8Su0nw8HP2k1KlqJ\nBxPZQapJg+9S8xlldxnj2VLZqOQngo8YD8vM0dYsT8a1bbwRrLnepOpuT808HolN\nDWzNN3pjMYkiir/ZJv/SC7jgjQKBgQDfIdREyMOhH56y4HCzzsN9IeztoKjjp01g\nOuve2U17vLOshxh6kDV/5rBEQCFpV/Vks68dtTQ0WLfPJMhub5d43nKcpvXobpc8\nt+Wy3ahTbff4HPNvM77FbU0eEG5Qkr1NVLQTTPawKCIJABeFbLmo+XeknSrjklqU\nvn8rmqs5oQKBgQDahg3gTtdLe8n7fmJ/vF9WTUSmKukhMqyhHJDnIYmr0/oZ2k+6\nw0Bi6ay2e9lRM+yAFb4Vi29lxcgE7wSPNE14TF4RTONRtUd/2GXyPTeTuj2pnvN9\n4/IS12jUerjAKPAdXwTTx3NSblDd/WachkcL6PGbGYvw2iHXvzNOEigsYQKBgAWv\nkP8ntoR2j86zFWwfiq+3m5f6jhMvAjO/jJ8jHmxWxKVS0/bbkeFueXNjxvYuPZyR\nT5cMNQZYdGac41adFVkJIhaH0qBXoRb1AK9sIovts3HpGvLseKIDRQHNHWKEOrqr\nu+L6BRc8DpH4JKFLwfdiVAAn2R3vbst3hzoPOOnBAoGBAIR8krS9pIOWWofkQXCX\nh4tkeNPFOceK1acH2DqSsr8Q4f37Za3XDsYSU6AwJMOV3wOz+nNRKuIPGXnafXNq\nn8AsY++o7psyHvJPQnp4yV4NOGeETAbwoGc38TEs9NfAWE5BZQcFlfV25rpT0uPM\nsJ0IJnR/STtynEIUnYSPd1Ch\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-uth9l@doctor-portal-34e27.iam.gserviceaccount.com",
    client_id: "115331743612640280691",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uth9l%40doctor-portal-34e27.iam.gserviceaccount.com",
  }),
});

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ebky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }
  next();
}

async function run() {
  try {
    await client.connect();
    const database = client.db("doctors_portal");
    const appointmentsCollecion = database.collection("appointments");
    const usersCollecion = database.collection("users");

    app.get("/appointments", async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      console.log(query);
      const cursor = appointmentsCollecion.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    app.post("/appointments", async (req, res) => {
      const appoinment = req.body;
      const result = await appointmentsCollecion.insertOne(appoinment);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollecion.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollecion.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    app.put("/users/admin", verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollecion.findOne({
          email: requester,
        });
        if (requesterAccount.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await usersCollecion.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res.status(403);
      }
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollecion.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Doctor Portal Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
