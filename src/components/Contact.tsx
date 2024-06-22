import emailjs from "@emailjs/browser";
import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/contact.module.css";
import { FaEnvelope, FaTextHeight } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";

type Status = "Send" | "Sending..." | "Email sent!" | "Error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState<Status>("Send");

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatusMsg("Sending...");
    const templateVals = { name, email, message };
    setName("");
    setEmail("");
    setMessage("");
    try {
      await emailjs.send(
        "service_e6jvzcu",
        "template_soeiwjl",
        templateVals,
        "0GjINiaEuMIa7iOfQ"
      );
      setStatusMsg("Email sent!");
    } catch (err: any) {
      setStatusMsg("Error");
      console.log(err?.message);
    }
  }

  useEffect(() => {
    if (statusMsg === "Send" || statusMsg === "Sending...") return;
    setTimeout(() => {
      setStatusMsg("Send");
    }, 2000);
  }, [statusMsg]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Contact Us</p>
      <form className={styles.form}>
        <div className={styles.upper}>
          <div
            className={`${styles.email} ${email.length > 0 && styles.active}`}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.placeholder}>
              <FaEnvelope />
              <p>Email</p>
            </div>
          </div>
          <div className={`${styles.name} ${name.length > 0 && styles.active}`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className={styles.placeholder}>
              <FaPerson />
              <p>Name</p>
            </div>
          </div>
        </div>
        <div
          className={`${styles.message} ${message.length > 0 && styles.active}`}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className={styles.placeholder}>
            <FaTextHeight />
            <p>Message</p>
          </div>
        </div>
        <button onClick={handleSend} disabled={statusMsg === "Sending..."}>
          {statusMsg}
        </button>
      </form>
    </div>
  );
}
