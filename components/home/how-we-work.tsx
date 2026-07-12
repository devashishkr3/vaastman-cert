"use client";

import {
	IconBulbFilled,
	IconCircleCheckFilled,
	IconCodeCircle2Filled,
	IconHeartFilled,
	IconMessage2Filled,
	IconPaintFilled,
} from "@tabler/icons-react";
import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

/* ─── Process steps ───────────────────────────────────────────────────── */

interface Step {
	icon: React.ElementType;
	title: string;
	description: string;
	accent: string;
	accentBg: string;
}

const steps: Step[] = [
	{
		icon: IconMessage2Filled,
		title: "Discover",
		description:
			"We listen first. Deep-dive into your business goals, users, and constraints before writing a single line of code.",
		accent: "text-sky-500 dark:text-sky-400",
		accentBg: "bg-sky-500/10",
	},
	{
		icon: IconPaintFilled,
		title: "Design",
		description:
			"Figma-first wireframes and prototypes you can click through. We iterate until the UX feels effortless.",
		accent: "text-pink-500 dark:text-pink-400",
		accentBg: "bg-pink-500/10",
	},
	{
		icon: IconCodeCircle2Filled,
		title: "Develop",
		description:
			"Clean, tested code on modern stacks. Weekly demos keep you in the loop — no surprises at launch.",
		accent: "text-violet-500 dark:text-violet-400",
		accentBg: "bg-violet-500/10",
	},
	{
		icon: IconCircleCheckFilled,
		title: "Deliver",
		description:
			"Rigorous QA, performance audits, and smooth deployment. We don't ship until it's production-ready.",
		accent: "text-emerald-500 dark:text-emerald-400",
		accentBg: "bg-emerald-500/10",
	},
	{
		icon: IconHeartFilled,
		title: "Support",
		description:
			"Post-launch monitoring, bug fixes, and feature iterations. We stay with you long after go-live.",
		accent: "text-amber-500 dark:text-amber-400",
		accentBg: "bg-amber-500/10",
	},
];

/* ─── Differentiators ─────────────────────────────────────────────────── */

const differentiators = [
	{
		icon: IconBulbFilled,
		label: "Dedicated Team",
		detail: "Your project gets a focused squad, not a shared bench.",
	},
	{
		icon: IconMessage2Filled,
		label: "Transparent Communication",
		detail: "Weekly standups, shared boards, and zero radio silence.",
	},
	{
		icon: IconCodeCircle2Filled,
		label: "Code You Own",
		detail: "Full source access from day one — no lock-in, ever.",
	},
	{
		icon: IconCircleCheckFilled,
		label: "Fixed-Price or T&M",
		detail: "Choose the engagement model that fits your budget.",
	},
];

/* ─── Animation variants ──────────────────────────────────────────────── */

const headerFade = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
} satisfies Variants;

const stagger = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12 } },
} satisfies Variants;

const fadeUp = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
} satisfies Variants;

const lineGrow = {
	hidden: { scaleY: 0 },
	visible: {
		scaleY: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

/* ─── Component ───────────────────────────────────────────────────────── */

export function HowWeWork() {
	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section ref={ref} className="py-16" id="how-we-work">
			{/* ── Header ──────────────────────────────────────────────── */}
			<motion.div
				className="mb-12 flex flex-col items-center gap-3 text-center"
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				variants={headerFade}
			>
				<Badge
					variant="outline"
					className="w-fit border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
				>
					Our Process
				</Badge>
				<h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
					How we turn ideas into products
				</h2>
				<p className="max-w-lg text-sm text-muted-foreground">
					A proven five-stage workflow that keeps every project on
					scope, on time, and on budget — with you in the driver's
					seat at every milestone.
				</p>
			</motion.div>

			{/* ── Timeline ────────────────────────────────────────────── */}
			<motion.div
				className="relative mx-auto max-w-3xl"
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				variants={stagger}
			>
				{/* Vertical connector line (desktop only) */}
				<motion.div
					className="absolute left-[23px] top-0 hidden h-full w-px origin-top bg-border/70 md:block"
					variants={lineGrow}
					aria-hidden
				/>

				<div className="flex flex-col gap-8">
					{steps.map((step, i) => {
						const Icon = step.icon;
						return (
							<motion.div
								key={step.title}
								variants={fadeUp}
								className="group relative flex gap-5"
							>
								{/* Step marker */}
								<div className="relative z-10 flex flex-col items-center">
									<div
										className={`flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md ${step.accentBg}`}
									>
										<Icon
											className={`size-5 ${step.accent}`}
										/>
									</div>
								</div>

								{/* Content */}
								<div className="flex flex-1 flex-col gap-1.5 pb-2 pt-1">
									<div className="flex items-center gap-3">
										<span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
											{String(i + 1).padStart(2, "0")}
										</span>
										<h3 className="text-base font-bold text-foreground">
											{step.title}
										</h3>
									</div>
									<p className="max-w-md text-sm leading-relaxed text-muted-foreground">
										{step.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</motion.div>

			{/* ── Differentiators strip ────────────────────────────────── */}
			<motion.div
				className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				variants={stagger}
			>
				{differentiators.map((d) => {
					const Icon = d.icon;
					return (
						<motion.div
							key={d.label}
							variants={fadeUp}
							className="group flex gap-3.5 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
						>
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
								<Icon className="size-5" />
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-sm font-bold text-foreground">
									{d.label}
								</span>
								<span className="text-xs leading-snug text-muted-foreground">
									{d.detail}
								</span>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</section>
	);
}
