import styles from "@/app/offer-preview/preview.module.css";

const videoUrl = "https://mancasvel.github.io/flowsight-guides/assets/complete-guide/FlowSight-Complete-Guide-EN.mp4?v=6f5b7d037cfc";
const guideUrl = "https://mancasvel.github.io/flowsight-guides/app-guide/";

export function AppGuide() {
  return (
    <section id="app-guide" className={styles.guideSection} aria-labelledby="app-guide-title">
      <div className={styles.sectionIntro}>
        <h2 id="app-guide-title">See FlowSight<br /><span>in action.</span></h2>
        <p id="app-guide-description">Follow the app from your first task to your work report. This short guide covers planning, Pomodoro, Total Focus, Insights and the controls around your data.</p>
      </div>
      <video
        className={styles.guideVideo}
        controls
        playsInline
        preload="none"
        poster="/product/flowsight-complete-guide.jpg"
        aria-label="FlowSight complete app guide"
        aria-describedby="app-guide-description app-guide-note"
      >
        <source src={videoUrl} type="video/mp4" />
        <track kind="captions" src="/product/flowsight-complete-guide.vtt?v=6f5b7d037cfc" srcLang="en" label="English" />
        Your browser does not support this video. <a href={guideUrl}>Watch the guide and read the transcript.</a>
      </video>
      <div className={styles.guideDetails}>
        <p id="app-guide-note">English narration and captions. FlowSight 6.1.0 with illustrative demo data; optional Cloud features depend on your plan.</p>
        <a href={guideUrl}>Chapters and transcript</a>
      </div>
    </section>
  );
}
