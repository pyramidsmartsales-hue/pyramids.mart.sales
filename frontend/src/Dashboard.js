import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [newClient, setNewClient] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get("http://localhost:5000/api/clients");
    setClients(res.data);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!message && !image) {
      alert("أدخل رسالة أو صورة أو كليهما!");
      return;
    }
    if (!selected.length) {
      alert("حدد عملاء للإرسال.");
      return;
    }
    const formData = new FormData();
    formData.append("message", message);
    if (image) formData.append("image", image);
    formData.append("clients", JSON.stringify(selected));
    await axios.post("http://localhost:5000/api/send", formData);
    alert("تم الإرسال!");
    setSelected([]);
    setMessage("");
    setImage(null);
  };

  const handleNewClientChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.phone) {
      alert("الاسم ورقم الجوال مطلوبان.");
      return;
    }
    await axios.post("http://localhost:5000/api/clients", newClient);
    setNewClient({ name: "", phone: "", city: "" });
    fetchClients();
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", direction: "rtl" }}>
      <h2>لوحة العملاء</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="اسم العميل"
          value={newClient.name}
          onChange={handleNewClientChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="رقم الجوال (مع كود الدولة)"
          value={newClient.phone}
          onChange={handleNewClientChange}
        />
        <input
          type="text"
          name="city"
          placeholder="المدينة"
          value={newClient.city}
          onChange={handleNewClientChange}
        />
        <button onClick={handleAddClient}>إضافة عميل</button>
      </div>
      <textarea
        placeholder="اكتب الرسالة"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: 80 }}
      />
      <input type="file" onChange={handleUpload} />
      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>تحديد</th>
            <th>الاسم</th>
            <th>رقم الواتساب</th>
            <th>المدينة</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(c.id)}
                  onChange={() => handleSelect(c.id)}
                />
              </td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSend}
        style={{ marginTop: 10, padding: "10px 30px", fontWeight: "bold" }}
      >
        إرسال للكل المحدد
      </button>
    </div>
  );
}

export default Dashboard;