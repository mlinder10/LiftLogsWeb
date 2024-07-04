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
          <p className={styles["section-description"]}>
            Discover a diverse range of exercises designed to enhance your
            workout routine. With detailed instructions, video demonstrations,
            and expert tips, Lift Logs ensures you perform each exercise with
            proper form and technique. Whether you're a beginner or a seasoned
            athlete, find new ways to challenge yourself and achieve your
            fitness goals with our comprehensive exercise library.
          </p>
        </div>
      </div>

      <div className={styles["plan-container"]}>
        <div className={styles["txt-container"]}>
          <p className={styles["section-title"]}>Plan Your Next Step</p>
          <p className={styles["section-description"]}>
            Create a clear path to your fitness goals with tailored workout
            plans. Lift Logs offers a variety of structured routines designed to
            fit your unique needs, whether you're focused on strength,
            endurance, or overall fitness. Each plan comes with detailed
            schedules, step-by-step instructions, and progress tracking to keep
            you motivated and on track. Choose from expertly crafted plans or
            customize your own to suit your personal preferences and fitness
            level. Start planning your next step today and see the results
            you’ve been working towards.
          </p>
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
