"use client";

import {
	IconBrandDiscord,
	IconBrandFigma,
	IconBrandGithub,
	IconBrandSlack,
	IconBrandZoom,
	IconBriefcase,
	IconCode,
	IconDeviceLaptop,
	IconExternalLink,
	IconGitBranch,
	IconMessages,
	IconShieldCheck,
	IconTerminal,
	IconUsers,
} from "@tabler/icons-react";
import { motion, useInView, type Variants } from "motion/react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Squad Roles Data ────────────────────────────────────────────────── */

interface TeamRole {
	id: string;
	role: string;
	title: string;
	tagline: string;
	description: string;
	responsibilities: string[];
	techStack: string[];
	icon: React.ElementType;
	color: string;
	accentBg: string;
}

const squadRoles: TeamRole[] = [
	{
		id: "tech-lead",
		role: "Product & Architecture",
		title: "Solutions Architect / PM",
		tagline: "Bridging business logic & technical blueprint",
		description:
			"Translates your business goals into a concrete development roadmap. Defines system architecture, plans sprints, and ensures alignment with your timeline.",
		responsibilities: [
			"System Architecture & DB Schema design",
			"API contracts & third-party integrations",
			"Sprint planning & weekly milestone demos",
		],
		techStack: ["Next.js", "Prisma", "PostgreSQL", "System Design"],
		icon: IconTerminal,
		color: "text-emerald-500 dark:text-emerald-400",
		accentBg: "bg-emerald-500/10",
	},
	{
		id: "frontend-engineer",
		role: "User Experience",
		title: "Frontend & UI Engineer",
		tagline: "Crafting fast, accessible, interactive interfaces",
		description:
			"Focuses on the visual performance, responsiveness, and polished animations. Transforms Figma designs into fluid React/Next.js pages.",
		responsibilities: [
			"Pixel-perfect responsive page layouts",
			"State management & client data-fetching",
			"Framer Motion animations & transitions",
		],
		techStack: ["React", "TypeScript", "Tailwind CSS", "Figma"],
		icon: IconDeviceLaptop,
		color: "text-violet-500 dark:text-violet-400",
		accentBg: "bg-violet-500/10",
	},
	{
		id: "backend-engineer",
		role: "Data & Scaling",
		title: "Backend & DevOps Engineer",
		tagline: "Ensuring secure, high-throughput backend services",
		description:
			"Secures the API layer, designs database queries, and manages cloud infrastructure. Builds automated CI/CD pipelines to deploy updates with zero downtime.",
		responsibilities: [
			"Server Actions & API endpoint security",
			"Database optimization & query performance",
			"Docker containerization & AWS/Vercel setup",
		],
		techStack: ["Node.js", "Bun", "Docker", "AWS / Vercel"],
		icon: IconCode,
		color: "text-sky-500 dark:text-sky-400",
		accentBg: "bg-sky-500/10",
	},
	{
		id: "qa-specialist",
		role: "Quality Assurance",
		title: "QA & Automation Specialist",
		tagline: "Zero-defect policy before production launch",
		description:
			"Performs rigorous testing under various conditions. Writes automated end-to-end tests to guarantee that new updates do not break existing features.",
		responsibilities: [
			"End-to-End browser tests (Playwright)",
			"API response validation & edge cases",
			"Performance and security vulnerability audits",
		],
		techStack: ["Playwright", "Jest", "Lighthouse", "SonarQube"],
		icon: IconShieldCheck,
		color: "text-amber-500 dark:text-amber-400",
		accentBg: "bg-amber-500/10",
	},
];

/* ─── Collaboration Tools ─────────────────────────────────────────────── */

const collabTools = [
	{
		icon: IconBrandSlack,
		name: "Slack / Discord",
		useCase: "Instant Chat & Standups",
		desc: "Daily updates, quick queries, and async check-ins.",
	},
	{
		icon: IconBrandGithub,
		name: "GitHub / Git",
		useCase: "Code Co-ownership",
		desc: "Pull request reviews, automated commits, and versioning.",
	},
	{
		icon: IconBrandFigma,
		name: "Figma",
		useCase: "Design Reviews",
		desc: "Real-time design collaboration, comments, and specs inspection.",
	},
	{
		icon: IconBrandZoom,
		name: "Video Syncs",
		useCase: "Weekly Demos",
		desc: "Live screenshare reviews of shipped features every week.",
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
	visible: { transition: { staggerChildren: 0.1 } },
} satisfies Variants;

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
} satisfies Variants;

/* ─── Component ───────────────────────────────────────────────────────── */

export function SquadShowcase() {
	const [activeRole, setActiveRole] = useState<string>("tech-lead");
	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, { once: true, margin: "-100px" });

	const currentRoleData = squadRoles.find((r) => r.id === activeRole)!;

	return (
		<section ref={ref} className="py-16 border-t border-border/50" id="dedicated-squad">
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
					Your Dedicated Team
				</Badge>
				<h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
					Meet your engineering squad
				</h2>
				<p className="max-w-xl text-sm text-muted-foreground">
					We don't rent out generalist resource pools. We assign a dedicated,
					multidisciplinary squad that functions as an extension of your own tech team.
				</p>
			</motion.div>

			{/* ── Interactive Role Explorer ────────────────────────────── */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Left Sidebar tabs */}
				<motion.div
					className="flex flex-col gap-2.5 lg:col-span-4"
					initial="hidden"
					animate={inView ? "visible" : "hidden"}
					variants={stagger}
				>
					{squadRoles.map((role) => {
						const Icon = role.icon;
						const isActive = activeRole === role.id;
						return (
							<motion.button
								key={role.id}
								variants={fadeUp}
								onClick={() => setActiveRole(role.id)}
								className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${
									isActive
										? "border-primary bg-primary/5 shadow-md shadow-primary/5"
										: "border-border/60 hover:border-border hover:bg-muted/40"
								}`}
							>
								<div
									className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
										isActive ? role.accentBg : "bg-muted"
									}`}
								>
									<Icon
										className={`size-5 ${
											isActive ? role.color : "text-muted-foreground"
										}`}
									/>
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										{role.role}
									</span>
									<span className="text-sm font-bold text-foreground">
										{role.title}
									</span>
								</div>
							</motion.button>
						);
					})}
				</motion.div>

				{/* Right Detail Pane */}
				<div className="lg:col-span-8">
					<Card className="h-full border-border/60 shadow-sm">
						<CardContent className="flex flex-col justify-between p-6 md:p-8 h-full min-h-[360px]">
							<div className="flex flex-col gap-5">
								{/* Header details */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex flex-col gap-1">
										<Badge
											variant="secondary"
											className="w-fit text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none"
										>
											{currentRoleData.role}
										</Badge>
										<h3 className="text-xl font-extrabold text-foreground">
											{currentRoleData.title}
										</h3>
										<p className="text-xs font-semibold text-primary">
											{currentRoleData.tagline}
										</p>
									</div>
									<div
										className={`flex size-12 items-center justify-center rounded-xl ${currentRoleData.accentBg} ${currentRoleData.color}`}
									>
										<currentRoleData.icon className="size-6" />
									</div>
								</div>

								<p className="text-sm leading-relaxed text-muted-foreground">
									{currentRoleData.description}
								</p>

								{/* Responsibilities list */}
								<div className="flex flex-col gap-2">
									<span className="text-xs font-bold uppercase tracking-wider text-foreground">
										Core Focus Area:
									</span>
									<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
										{currentRoleData.responsibilities.map((r, i) => (
											<li
												key={i}
												className="flex items-start gap-2.5 text-xs text-muted-foreground"
											>
												<span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary" />
												<span>{r}</span>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Tech stack / Tools */}
							<div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/50 pt-5">
								<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
									Primary Stack:
								</span>
								{currentRoleData.techStack.map((tech) => (
									<Badge
										key={tech}
										variant="outline"
										className="rounded-md border-border/70 text-xs px-2.5 py-0.5 text-muted-foreground font-mono"
									>
										{tech}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* ── Collaboration Section ─────────────────────────────────── */}
			<div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
				<div className="lg:col-span-5 flex flex-col gap-3.5">
					<Badge
						variant="outline"
						className="w-fit border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary"
					>
						Collaboration Stack
					</Badge>
					<h3 className="text-2xl font-bold text-foreground">
						100% transparency in real-time
					</h3>
					<p className="text-sm leading-relaxed text-muted-foreground">
						We integrate directly into your workflows. You get complete transparency with direct access to code repositories, Figma project files, project taskboards, and messaging channels.
					</p>
					<div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<IconGitBranch className="size-4 text-primary" />
							<span>Direct access to Dev branch</span>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<IconMessages className="size-4 text-primary" />
							<span>Shared Slack/Discord workspace</span>
						</div>
					</div>
				</div>

				<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{collabTools.map((tool) => {
						const Icon = tool.icon;
						return (
							<Card key={tool.name} className="border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors duration-300">
								<CardContent className="p-4 flex gap-4">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card border border-border/60 text-foreground shadow-sm">
										<Icon className="size-5" />
									</div>
									<div className="flex flex-col gap-0.5">
										<span className="text-xs font-bold uppercase tracking-wider text-primary">
											{tool.useCase}
										</span>
										<span className="text-sm font-bold text-foreground leading-tight">
											{tool.name}
										</span>
										<span className="text-xs text-muted-foreground leading-snug mt-1">
											{tool.desc}
										</span>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
