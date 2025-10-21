const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");
const wa = require("./wa");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: path.join(__dirname, "uploads") });

// جلب كل العملاء
app.get("/api/clients", (req, res) => {
  db.all("SELECT * FROM clients", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// إضافة عميل جديد
app.post("/api/clients", (req, res) => {
  const { name, phone, city } = req.body;
  db.run(
    "INSERT INTO clients (name, phone, city) VALUES (?, ?, ?)",
    [name, phone, city],
    function (err) {
      if (err) return res.status(500).send(err);
      res.json({ id: this.lastID });
    }
  );
});

// إرسال رسالة وصورة للعملاء المحددين
app.post("/api/send", upload.single("image"), async (req, res) => {
  const message = req.body.message;
  const clients = JSON.parse(req.body.clients || "[]");
  let imagePath = req.file ? req.file.path : null;

  if (!clients.length) return res.status(400).json({ error: "لا يوجد عملاء محددين" });

  db.all(
    `SELECT phone FROM clients WHERE id IN (${clients.map(() => "?").join(",")})`,
    clients,
    async (err, rows) => {
      if (err) return res.status(500).send(err);
      const phones = rows.map((r) => r.phone);
      try {
        await wa.sendBulkMessage(phones, message, imagePath);
        res.json({ status: "ok" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));