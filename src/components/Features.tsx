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
          <p className={styles["learn-title"]}>Learn New Exercises</p>
          <p className={styles["learn-description"]}>Some description</p>
        </div>
      </div>

      <div className={styles["track-container"]}>
        <p className={styles["track-title"]}>Track Your Progress</p>
        <div className={styles["img-container"]}>
          <img src="src/assets/workout-active.png" alt="" />
          <img src="src/assets/charts.png" alt="" />
          <img src="src/assets/charts.png" alt="" />
        </div>
      </div>

      <div className={styles["next-step-container"]}>
        <div>
          <p>Plan Your Next Step</p>
        </div>
        <div>
          <img src="src/assets/plan.png" alt="" />
          <img src="src/assets/plan-list.png" alt="" />
        </div>
      </div>
    </section>
  );
}
