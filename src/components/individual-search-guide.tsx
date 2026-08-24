import { siteConfig } from "@/lib/site";

const comparisonRows = [
  {
    criterion: "How tracking starts",
    timer: "You start, stop, and label a timer",
    flowsight: "The desktop agent runs quietly while you work",
  },
  {
    criterion: "Where detailed context goes",
    timer: "Depends on the service and account settings",
    flowsight: "Screen context is analysed locally on your device",
  },
  {
    criterion: "What you review",
    timer: "Hours assigned to projects or tasks",
    flowsight: "Focus blocks, context switches, categories, and a readable work summary",
  },
] as const;

const questions = [
  {
    question: "Does FlowSight upload screenshots?",
    answer:
      "No raw screen context is uploaded to a manager feed. FlowSight reads screen context on your device so its bundled local model can classify work. Optional cloud features receive selected data only after you activate them.",
  },
  {
    question: "Can I use FlowSight without an account?",
    answer:
      "Yes. Free local mode works without an account and includes local activity analysis, cognitive health tracking, deep-focus detection, and on-device pattern learning. An account is needed only when you choose paid cloud features.",
  },
  {
    question: "Is FlowSight a time tracker?",
    answer:
      "FlowSight is a time-tracker alternative for people who need context, not just a timer. It turns the shape of a workday into focus patterns and summaries, so you can understand what moved forward without reconstructing every task manually.",
  },
  {
    question: "Can FlowSight track deep work and context switching?",
    answer:
      "Yes. FlowSight identifies sustained focus and the interruptions or app changes that fragment it. The result is a private view of when you concentrate best and where your day loses continuity.",
  },
  {
    question: "Which platforms does FlowSight support?",
    answer:
      "FlowSight publishes desktop releases for Windows, macOS, and Linux. The download centre detects your platform and also lets you choose another installer directly.",
  },
] as const;

export function IndividualSearchGuide() {
  return (
    <section id="private-productivity" className="border-y border-[var(--line)] bg-[var(--surface-soft)] px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="private-tracker-heading">
      <div className="mx-auto max-w-[82rem]">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <h2 id="private-tracker-heading" className="max-w-[14ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
            What is a private productivity tracker?
          </h2>
          <div>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
              A private productivity tracker helps you understand how your own work unfolds while keeping detailed activity under your control. FlowSight runs local AI on your device to interpret screen context, identify deep-work and context-switching patterns, and produce a daily work summary. Free local mode does not require an account, and cloud features stay optional.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              The core implementation is <a href="https://github.com/Mancasvel/FlowSight.AI" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--accent-strong)]">available to inspect on GitHub</a>. For the company-wide privacy model, read FlowSight&apos;s <a href={`${siteConfig.companyUrl}/security`} className="font-semibold text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--accent-strong)]">security overview</a>.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]" role="region" aria-label="FlowSight and time tracker comparison" tabIndex={0}>
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">FlowSight compared with a traditional manual time tracker</caption>
            <thead className="bg-[#071419] text-[#f4fffd]">
              <tr>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Criterion</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">Traditional time tracker</th>
                <th scope="col" className="px-5 py-4 text-sm font-semibold">FlowSight Individual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {comparisonRows.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row" className="px-5 py-5 text-sm font-semibold text-[var(--ink)]">{row.criterion}</th>
                  <td className="px-5 py-5 text-sm leading-6 text-[var(--muted)]">{row.timer}</td>
                  <td className="px-5 py-5 text-sm leading-6 text-[var(--muted)]">{row.flowsight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">Private focus tracking, answered plainly</h2>
          <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {questions.map((item) => (
              <article key={item.question}>
                <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-[var(--ink)]">{item.question}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
