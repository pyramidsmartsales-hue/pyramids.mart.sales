const { create } = require("@open-wa/wa-automate");
let client = null;

// إذا لم يظهر QR: يمكنك تعديل create({ headless: false, useChrome: true })
create().then((waClient) => {
  client = waClient;
  console.log("WhatsApp client is ready!");
});

async function sendBulkMessage(numbers, message, imagePath) {
  if (!client) throw new Error("WhatsApp client not ready");
  for (let number of numbers) {
    // تنظيف الرقم وتهيئته بصيغة واتساب
    let phone = number.replace(/\D/g, "");
    if (!phone.endsWith("@c.us")) phone += "@c.us";
    if (imagePath) {
      await client.sendImage(phone, imagePath, "image.jpg", message);
    } else {
      await client.sendText(phone, message);
    }
  }
}

module.exports = { sendBulkMessage };