import styles from "../styles/features.module.css";
import exercise from "../assets/exercise.png";
import planList from "../assets/planlist.png";
import plan from "../assets/plan.png";
import activeWorkout from "../assets/activeworkout.png";
import charts from "../assets/charts.png";
import summary from "../assets/summary.png";

export default function Features() {
  return (
    <section className={styles.container}>
      <div className={styles["learn-container"]}>
        <img src={exercise} alt="" className={styles["learn-img"]} />
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
            src={planList}
            alt=""
          />
          <img
            className={`${styles["plan-img"]} ${styles["plan"]}`}
            src={plan}
            alt=""
          />
        </div>
      </div>

      <div className={styles["track-container"]}>
        <p className={styles["track-title"]}>Track Your Progress</p>
        <div className={styles["img-container"]}>
          <img src={activeWorkout} alt="" />
          <img src={charts} alt="" />
          <img src={summary} alt="" />
        </div>
      </div>
    </section>
  );
}
