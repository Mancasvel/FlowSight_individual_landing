"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Browser, Code, FileText, LockSimple, MagnifyingGlass, Target, Timer } from "@phosphor-icons/react";
import summaryCapture from "../../public/product/flowsight-summary.png";
import todayCapture from "../../public/product/flowsight-today.png";
import styles from "@/app/offer-preview/preview.module.css";

const examples = [
  { label: "Building", time: "52 min", app: "Browser", context: "Debugging a checkout flow", type: "Development", detail: "Testing the payment flow and reading API documentation belong to the same piece of work.", icon: Code, dots: 42 },
  { label: "Researching", time: "34 min", app: "Browser", context: "Comparing design approaches", type: "Research", detail: "Reading references and weighing options is research, even when the app in front stays the same.", icon: MagnifyingGlass, dots: 28 },
  { label: "Planning", time: "18 min", app: "Browser", context: "Planning the next release", type: "Planning", detail: "Reviewing tickets and writing the next steps gives this block a different purpose.", icon: FileText, dots: 16 },
] as const;

export function ContextDemo() {
  const [intelligent, setIntelligent] = useState(true);
  const [selected, setSelected] = useState(0);
  const active = examples[selected];
  const Icon = active.icon;
  return (
    <div className={styles.contextDemo}>
      <div className={styles.demoTop}><span>Same app. More context.</span><span className={styles.demoExample}>Interactive example</span></div>
      <div className={styles.demoSwitch} role="group" aria-label="Compare activity views">
        <button type="button" aria-pressed={!intelligent} onClick={() => setIntelligent(false)}>App activity</button>
        <button type="button" aria-pressed={intelligent} onClick={() => setIntelligent(true)}>With FlowSight AI <ArrowUpRight size={14} aria-hidden /></button>
      </div>
      <div className={styles.dotDiagram} aria-hidden="true" data-intelligent={intelligent}>
        {examples.map((example, group) => <div key={example.label} className={styles.dotGroup} data-selected={selected === group}>
          {Array.from({ length: 48 }, (_, dot) => <i key={dot} data-filled={dot < example.dots} style={{ "--dot-order": dot % 8 } as CSSProperties} />)}
        </div>)}
      </div>
      <div className={styles.exampleChoices} role="group" aria-label="Explore a work block">
        {examples.map((example, index) => {
          const ExampleIcon = intelligent ? example.icon : Browser;
          return <button key={example.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><ExampleIcon size={18} aria-hidden /><span>{intelligent ? example.label : example.app}<small>{example.time}</small></span></button>;
        })}
      </div>
      <div className={styles.demoResult} aria-live="polite" aria-atomic="true">
        <div className={styles.resultTitle}>{intelligent ? <Icon size={20} aria-hidden /> : <Browser size={20} aria-hidden />}<span>{intelligent ? active.type : "Application detected"}</span><span>{active.time}</span></div>
        <p className={styles.resultHeading}>{intelligent ? active.context : "Time spent in your browser"}</p>
        <p className={styles.resultDetail}>{intelligent ? active.detail : "An app name tells you where time went. Switch to the AI view to explore the context behind this example."}</p>
      </div>
      <div className={styles.demoFooter}><LockSimple size={14} aria-hidden /><span>On-device analysis</span><span>Illustrative data, not a live AI session</span></div>
    </div>
  );
}

const productViews = [
  { id: "insights", label: "Understand your day", icon: Target, image: summaryCapture, title: "The pattern behind the hours.", description: "See recorded time, work categories and sustained focus in one view. Open a work report for today, seven days or thirty days, then decide what to try next.", alt: "Actual FlowSight 6.1.0 Insights screen with example data: 3 hours 20 minutes recorded, 50% sustained focus, and Coding, Research, Planning and Communication categories", points: ["Meaningful categories, beyond app names", "Sustained focus and attention patterns", "Daily Flow, report periods and work reviews"] },
  { id: "today", label: "Shape your day", icon: Timer, image: todayCapture, title: "A little intention goes a long way.", description: "Choose normal tracking or Pomodoro, name your task and set your daily goal. Plan the next session with local AI or start total focus from the same screen.", alt: "Actual FlowSight 6.1.0 Today screen with normal and Pomodoro modes, 3 hours 20 minutes recorded towards a four-hour goal, tracking controls and total focus. Example data.", points: ["Normal timer or Pomodoro", "Session planning with your local AI", "Total focus linked to the main clock"] },
] as const;

export function ProductExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const view = productViews[selected];
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % productViews.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + productViews.length - 1) % productViews.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = productViews.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return <>
    <div className={styles.productCopy}>
      <h2 id="product-title">Meet your day.<br /><span>In a new light.</span></h2>
      <p className={styles.productLead}>Less guessing where the time went.<br />More understanding what moved forward.</p>
      <div className={styles.productTabs} role="tablist" aria-label="Explore the real app">
        {productViews.map((item, index) => <button type="button" key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={selected === index} aria-controls={`panel-${item.id}`} tabIndex={selected === index ? 0 : -1} ref={(element) => { tabs.current[index] = element; }} onClick={() => setSelected(index)} onKeyDown={(event) => onTabKey(event, index)}><item.icon size={20} aria-hidden /><span>{item.label}</span><ArrowRight size={16} aria-hidden /></button>)}
      </div>
      <div className={styles.productExplanation} aria-live="polite" aria-atomic="true"><h3>{view.title}</h3><p>{view.description}</p><ul>{view.points.map((point) => <li key={point}><span aria-hidden="true" />{point}</li>)}</ul></div>
    </div>
    <div className={styles.productStage}>
      {productViews.map((item, index) => <div key={item.id} role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`} hidden={selected !== index} tabIndex={0}><Image src={item.image} alt={item.alt} width={460} height={920} sizes="(max-width: 600px) 80vw, 345px" className={styles.productImage} /></div>)}
      <p>FlowSight 6.1.0 · Windows <span>Example activity</span></p>
    </div>
  </>;
}
