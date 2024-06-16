import styles from "../styles/hero.module.css";

export default function Hero() {
  return (
    <section className={styles.container}>
      <img src="src/assets/logo.png" alt="" className={styles.logo} />
      <div className={styles["txt-container"]}>
        <h1>Lift Logs</h1>
        <p>Conquer the gym</p>
        <a className={styles["download-btn"]}>Download</a>
      </div>
    </section>
  );
}
