"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function HeroProduct() {
  return (
    <motion.div
      initial={{ y: 22, scale: 0.985 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ duration: 0.72, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
      className="motion-hero dark-grid relative mx-auto h-[28rem] w-full max-w-[44rem] overflow-hidden rounded-2xl border border-white/10 bg-[#071419] shadow-[0_28px_80px_rgba(5,40,45,0.18)] sm:h-[35rem] lg:h-[37rem]"
    >
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8 sm:px-9 sm:py-10">
        <div className="relative w-full max-w-[39rem]">
          <div className="relative rounded-[1.2rem] border border-[#4b5c60] bg-[#11191c] p-[5px] shadow-[0_24px_55px_rgba(0,0,0,0.48)] sm:p-[7px]">
            <span className="absolute left-1/2 top-[2px] z-20 h-1 w-1 -translate-x-1/2 rounded-full bg-[#526166] sm:top-[3px]" aria-hidden />
            <div className="laptop-desktop relative aspect-[16/10] overflow-hidden rounded-[0.9rem] border border-black/80">
              <div className="absolute bottom-[12%] left-[3%] top-[14%] w-[64%] overflow-hidden rounded-[0.45rem] border border-black/10 bg-[#fbfbfa] text-[#242424] shadow-[0_16px_38px_rgba(0,0,0,0.32)] sm:rounded-[0.65rem]" aria-hidden="true">
                <div className="flex h-6 items-center justify-between border-b border-[#e9e9e7] px-2 sm:h-8 sm:px-3">
                  <span className="grid h-3.5 w-3.5 place-items-center border border-[#242424] font-heading text-[7px] font-bold leading-none sm:h-4 sm:w-4 sm:text-[8px]">N</span>
                  <div className="flex gap-1" aria-hidden>
                    <span className="h-1 w-1 rounded-full bg-[#c8c8c5]" />
                    <span className="h-1 w-1 rounded-full bg-[#c8c8c5]" />
                    <span className="h-1 w-1 rounded-full bg-[#c8c8c5]" />
                  </div>
                </div>
                <div className="flex h-full">
                  <div className="w-[28%] border-r border-[#ededeb] bg-[#f7f7f5] px-2 py-2 text-[5px] leading-3 text-[#575650] sm:px-3 sm:py-3 sm:text-[7px] sm:leading-4">
                    <p className="font-semibold text-[#37352f]">Workspace</p>
                    <p className="mt-1.5">Today</p>
                    <p>Projects</p>
                    <p>Notes</p>
                  </div>
                  <div className="min-w-0 flex-1 px-3 py-3 sm:px-5 sm:py-4">
                    <p className="text-[5px] font-medium text-[#5f5e59] sm:text-[7px]">PERSONAL</p>
                    <p className="mt-1 font-heading text-[11px] font-semibold tracking-[-0.02em] sm:mt-2 sm:text-base">Weekly planning</p>
                    <p className="mt-1 text-[5px] text-[#575650] sm:text-[7px]">A clear view of the week ahead.</p>
                    <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3" aria-hidden>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-[2px] border border-[#b9b8b5] bg-white sm:h-3 sm:w-3" />
                        <span className="h-1 w-[68%] rounded-full bg-[#ddddda]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-[2px] border border-[#b9b8b5] bg-white sm:h-3 sm:w-3" />
                        <span className="h-1 w-[54%] rounded-full bg-[#ddddda]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-[2px] border border-[#b9b8b5] bg-white sm:h-3 sm:w-3" />
                        <span className="h-1 w-[76%] rounded-full bg-[#ddddda]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-[2%] top-[2%] z-20 w-[30%] overflow-hidden rounded-[0.4rem] border border-white/40 bg-[#f6f6f8] shadow-[0_18px_45px_rgba(0,0,0,0.52)] sm:rounded-[0.55rem]">
                <Image
                  src="/product/flowsight-summary.png"
                  alt="FlowSight Summary in a small side window beside a planning document on a laptop desktop"
                  width={460}
                  height={920}
                  sizes="(max-width: 768px) 28vw, 200px"
                  className="h-auto w-full"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="absolute bottom-2 left-1/2 z-20 flex h-6 -translate-x-1/2 items-center gap-1.5 rounded-md border border-white/15 bg-[#0a171a]/72 px-2 shadow-lg backdrop-blur-md sm:bottom-3 sm:h-8 sm:gap-2 sm:px-2.5" aria-hidden>
                <span className="h-3.5 w-3.5 overflow-hidden rounded-[4px] bg-white sm:h-5 sm:w-5">
                  <Image src="/flowsight-icon-180.png" alt="" width={20} height={20} className="h-full w-full" />
                </span>
                <span className="h-2.5 w-2.5 rounded-[3px] bg-white/72 sm:h-4 sm:w-4" />
                <span className="h-2.5 w-2.5 rounded-[3px] bg-[#5eead4]/80 sm:h-4 sm:w-4" />
                <span className="h-2.5 w-2.5 rounded-[3px] bg-white/52 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>

          <div className="relative left-1/2 h-3 w-[106%] -translate-x-1/2 bg-gradient-to-b from-[#879397] to-[#4b585c] [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)] sm:h-4" aria-hidden>
            <span className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full bg-[#263236] sm:w-24" />
          </div>
          <div className="relative left-1/2 h-1.5 w-[106%] -translate-x-1/2 rounded-b-[50%] bg-[#202a2d] shadow-[0_10px_24px_rgba(0,0,0,0.4)]" aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}
