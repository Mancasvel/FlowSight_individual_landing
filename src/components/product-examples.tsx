import type { CSSProperties } from "react";
import { CalendarBlank, Clock, Sparkle, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import styles from "@/app/offer-preview/preview.module.css";

// Website illustrations, not app screenshots. All values are deterministic examples.
export function CalendarExample() {
  return <figure className={styles.calendarExample} aria-label="Example session plan for Tuesday, 13 October">
    <div className={styles.exampleHeader}><span><CalendarBlank size={18} aria-hidden /> Your day, with a plan</span><span>October 2026</span></div>
    <div className={styles.calendarWeek} aria-label="Week of 12 October">
      {[["Mon", 12], ["Tue", 13], ["Wed", 14], ["Thu", 15], ["Fri", 16]].map(([day, date]) => <div key={day} data-selected={date === 13}><span>{day}</span><strong>{date}</strong></div>)}
    </div>
    <div className={styles.planIntention}><Sparkle size={17} aria-hidden /><p>“Finish the proposal before my 11:00 call.”<span>An example intention for the local AI</span></p></div>
    <div className={styles.calendarTimeline}>
      {["09:00", "10:00", "11:00", "12:00"].map((time, i) => <div className={styles.calendarHour} key={time} style={{ "--hour": i } as CSSProperties}><time>{time}</time><span /></div>)}
      <div className={styles.calendarEvent} data-kind="focus" style={{ "--start": 0, "--duration": 50 } as CSSProperties}><span>09:00 – 09:50 · Suggested</span><strong>Draft the proposal</strong><small>One task. Fifty clear minutes.</small></div>
      <div className={styles.calendarBreak}><span>09:50</span> Take a short break</div>
      <div className={styles.calendarEvent} data-kind="review" style={{ "--start": 60, "--duration": 30 } as CSSProperties}><span>10:00 – 10:30 · Suggested</span><strong>Review & refine</strong></div>
      <div className={styles.calendarEvent} data-kind="fixed" style={{ "--start": 120, "--duration": 30 } as CSSProperties}><span>11:00 – 11:30 · Existing event</span><strong>Team check-in</strong></div>
    </div>
    <div className={styles.calendarSummary}><Clock size={15} aria-hidden /><span>80 min of planned work</span><span>Ready for your review</span></div>
    <figcaption>Illustrative calendar · example data</figcaption>
  </figure>;
}

const exampleDays = [
  { day: "Mon", total: 300, focus: 120 },
  { day: "Tue", total: 330, focus: 150 },
  { day: "Wed", total: 240, focus: 60 },
  { day: "Thu", total: 330, focus: 180 },
  { day: "Fri", total: 270, focus: 90 },
];
const duration = (minutes: number) => `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`;
const recorded = exampleDays.reduce((sum, day) => sum + day.total, 0);
const focused = exampleDays.reduce((sum, day) => sum + day.focus, 0);

export function WeeklyReportExample() {
  return <figure className={styles.weeklyReport} aria-label="Illustrative FlowSight weekly report with example data">
    <div className={styles.exampleHeader}><span>Your weekly report</span><span>5–9 Oct 2026</span></div>
    <dl className={styles.reportStats}>
      <div><dt>Time recorded</dt><dd>{duration(recorded)}</dd></div>
      <div><dt>Sustained focus</dt><dd>{duration(focused)}</dd></div>
      <div><dt>Days observed</dt><dd>{exampleDays.length}<span> / 5</span></dd></div>
    </dl>
    <div className={styles.reportChart} role="img" aria-label={`Weekly recorded time and sustained focus. ${exampleDays.map(day => `${day.day}: ${duration(day.total)} recorded, ${duration(day.focus)} sustained focus`).join('. ')}.`}>
      <div className={styles.chartScale} aria-hidden><span>6h</span><span>3h</span><span>0h</span></div>
      <div className={styles.chartColumns}>
        {exampleDays.map(day => <div className={styles.chartDay} key={day.day} aria-label={`${day.day}: ${duration(day.total)} recorded, ${duration(day.focus)} sustained focus`}>
          <span className={styles.chartValue}>{duration(day.total)}</span>
          <div className={styles.chartTrack} aria-hidden><div className={styles.chartTotal} style={{ height: `${day.total / 360 * 100}%` }}><div className={styles.chartFocus} style={{ height: `${day.focus / day.total * 100}%` }} /></div></div>
          <span className={styles.chartDayLabel}>{day.day}</span>
        </div>)}
      </div>
    </div>
    <div className={styles.chartLegend}><span><i /> Sustained focus</span><span><i /> Other recorded time</span></div>
    <div className={styles.reportInsights}>
      <div><Sparkle size={18} aria-hidden /><p><strong>Thursday had the most sustained focus.</strong><span>3 hours across 5h 30m of recorded activity.</span></p></div>
      <div><Clock size={18} aria-hidden /><p><strong>Research & planning took 9 hours.</strong><span>5h of research and 4h of planning in this example week.</span></p></div>
      <div className={styles.reportSuggestion}><ArrowUpRight size={18} aria-hidden /><p><strong>Something to try next week</strong><span>Protect a 50-minute block for your main task, then review how it went.</span></p></div>
    </div>
    <figcaption>Illustrative report · example data, not a live analysis</figcaption>
  </figure>;
}
