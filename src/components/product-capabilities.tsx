import { ArrowUpRight, CalendarBlank, Timer, ShieldCheck, Bell, Sparkle, FilePdf, ListChecks, Plugs, UsersThree, Brain, Plus } from "@phosphor-icons/react/dist/ssr";
import { CalendarExample, WeeklyReportExample } from "./product-examples";
import styles from "@/app/offer-preview/preview.module.css";

const everydayTools = [
  { icon: Timer, title: "A timer that fits your rhythm", text: "Choose a normal timer or Pomodoro, set your daily goal and name your current task. Pause and resume without losing the time already recorded." },
  { icon: ShieldCheck, title: "Total focus, on your terms", text: "Choose websites to block, keep useful exceptions and set a focus duration. Browser Controls connects protection to the main clock. Windows can also silence notification banners during the block.", detail: "Requires the paired FlowSight Browser Controls extension. Website blocking does not require a cloud plan or a running AI model." },
  { icon: Bell, title: "Reminders with restraint", text: "Opt into local AI focus reminders based on observed activity. Decide separately whether a reminder may include your current task or an app name. Reminders wait while total focus is active.", detail: "Focus reminders are off by default. Notification controls shown here are from the current Windows app." },
  { icon: Sparkle, title: "Daily Flow & personal milestones", text: "See your recorded-day streak, weekly rhythm and personal milestones. A small daily step helps you build consistency; you can hide this view whenever you prefer." },
  { icon: FilePdf, title: "Reports you can keep", text: "Review today, the last 7 days or the last 30 days. Export a PDF, or schedule a weekly local PDF to a folder you choose while FlowSight is running. Reports identify their AI or rules-based origin." },
  { icon: ListChecks, title: "A local agent that can help", text: "Manage local tasks and calendar blocks, save preferences, prepare message drafts and PR descriptions, and run focus routines. Proposed changes show their target and wait for your confirmation.", detail: "Drafts stay drafts: the current local agent does not send messages or publish project updates. Browser actions require Browser Controls." },
] as const;

const connections = [
  { icon: CalendarBlank, title: "Google & Microsoft calendars", label: "Eligible paid cloud plan", text: "See your current event in Today. With separate permission, Calendar companion can append a short work recap to an event you organize. A recap can be visible to its guests." },
  { icon: Plugs, title: "Jira, Linear & Notion", label: "Account & integration access", text: "Bring connected project tasks into your day and publish a report to a Notion destination you select. Each service requires its own connection and the relevant access." },
  { icon: Brain, title: "Connect your own AI with MCP", label: "Optional external AI", text: "Let a compatible AI client read the FlowSight reports you request. Descriptions and ticket IDs are excluded by default; requested data is shared with the client you connect." },
  { icon: UsersThree, title: "Private leagues with friends", label: "Optional account & consent", text: "Create or join a private group and turn eligible focus blocks into weekly points. Friends see your alias, points and position. App names, tasks and screen captures stay out of leagues." },
] as const;

export function ProductCapabilities() {
  return <>
    <section id="features" className={styles.capabilitiesSection} aria-labelledby="capabilities-title">
      <div className={styles.featureStory}>
        <div className={styles.featureStoryCopy}>
          <h2 id="capabilities-title">A plan built around<br /><span>your actual day.</span></h2>
          <p>Tell the local AI what you want to finish and when you have time. It considers your tasks, preferences and recorded task time to suggest a session with clear work blocks.</p>
          <ol className={styles.featureSteps}><li><span>Describe</span> Your intention, estimates and fixed commitments.</li><li><span>Adjust</span> Review the draft and ask for changes.</li><li><span>Confirm</span> Add the reviewed blocks to your calendar.</li></ol>
          <p className={styles.featureFinePrint}>Planning runs locally. FlowSight is the default calendar; connected calendar destinations require an eligible connection.</p>
        </div>
        <CalendarExample />
      </div>
    </section>
    <section id="reports" className={`${styles.reportsSection} ${styles.featureStory}`} aria-labelledby="reports-title">
        <div className={styles.featureStoryCopy}>
          <h2 id="reports-title">Your week.<br /><span>With perspective.</span></h2>
          <p>See where your time went, when sustained focus happened and what you could try next. FlowSight brings the patterns together in a report you can actually use.</p>
          <p>Review a day, a week or a month. Keep a PDF, or schedule a weekly report to a local folder.</p>
          <p className={styles.featureFinePrint}>Based on recorded activity, with observed-day coverage and AI or rules-based origin identified in the app. A view of your working patterns, not a score for the quality of your work.</p>
        </div>
        <WeeklyReportExample />
    </section>
    <section className={styles.toolsSection} aria-labelledby="tools-title">
      <div className={styles.toolsHeading}><h2 id="tools-title">The tools around your day.</h2><p>Included local capabilities, with controls you choose.</p></div>
      <div className={styles.toolsGrid}>{everydayTools.map(tool=><article key={tool.title}><tool.icon size={24} weight="regular" aria-hidden /><h3>{tool.title}</h3><p>{tool.text}</p>{"detail" in tool && <details><summary>How it works <Plus size={14} aria-hidden /></summary><p>{tool.detail}</p></details>}</article>)}</div>
      <p className={styles.platformNote}>Product views and new features shown here are from FlowSight 6.1.0 for Windows. macOS and Linux releases follow their own update schedules.</p>
    </section>
    <section id="connections" className={styles.connectionsSection} aria-labelledby="connections-title">
      <div className={styles.sectionIntro}><h2 id="connections-title">Your day.<br /><span>Connected when useful.</span></h2><p>Local tracking and reports work without a cloud account. Add a connection when it helps, with a clear choice about what leaves your device.</p></div>
      <div className={styles.connectionList}>{connections.map(item=><article key={item.title}><item.icon size={25} aria-hidden /><div><h3>{item.title}</h3><span>{item.label}</span></div><p>{item.text}</p></article>)}</div>
      <a className={styles.textAction} href="https://github.com/Mancasvel/FlowSight.AI" target="_blank" rel="noopener noreferrer">Explore the current app and source <ArrowUpRight size={16} aria-hidden /></a>
    </section>
  </>;
}
