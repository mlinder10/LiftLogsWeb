import styles from "../styles/features.module.css";

export default function Features() {
  return (
    <section className={styles.container}>
      <div className={styles["learn-container"]}>
        <img
          src="src/assets/exercise.png"
          alt=""
          className={styles["learn-img"]}
        />
        <div className={styles["txt-container"]}>
          <p className={styles["section-title"]}>Learn New Exercises</p>
          <p className={styles["section-description"]}>Some description</p>
        </div>
      </div>

      <div className={styles["plan-container"]}>
        <div className={styles["txt-container"]}>
          <p className={styles["section-title"]}>Plan Your Next Step</p>
          <p className={styles["section-description"]}>Some description</p>
        </div>
        <div className={styles["plan-img-container"]}>
          <img
            className={`${styles["plan-img"]} ${styles["plan-list"]}`}
            src="src/assets/planlist.png"
            alt=""
          />
          <img
            className={`${styles["plan-img"]} ${styles["plan"]}`}
            src="src/assets/plan.png"
            alt=""
          />
        </div>
      </div>

      <div className={styles["track-container"]}>
        <p className={styles["track-title"]}>Track Your Progress</p>
        <div className={styles["img-container"]}>
          <img src="src/assets/activeworkout.png" alt="" />
          <img src="src/assets/charts.png" alt="" />
          <img src="src/assets/summary.png" alt="" />
        </div>
      </div>
    </section>
  );
}
