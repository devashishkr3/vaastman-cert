"use client";

import {
  IconArrowRight,
  IconBrandFigma,
  IconChevronRight,
  IconClick,
  IconCode,
  IconDatabase,
  IconDeviceDesktop,
  IconExternalLink,
  IconFileText,
  IconLayoutDashboard,
  IconListDetails,
  IconReceipt,
  IconServer,
  IconSmartHome,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from "motion/react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Projects Data ───────────────────────────────────────────────────── */

type ProjectCategory = "all" | "education" | "hospitality" | "enterprise";

interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  metrics: {
    label: string;
    value: string;
    icon: React.ElementType;
  };
  features: string[];
  techStack: string[];
  accentColor: string;
  accentBg: string;
  // Custom mock interface component to render inside the card
  mockup: React.ComponentType;
}

/* ─── Mockup Renderers ────────────────────────────────────────────────── */

// 1. SSDM College Portal Mockup
function SSDMCollegeMockup() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-4 font-mono text-[10px] text-emerald-300">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-xs text-foreground">
            SSDM Admissions Portal
          </span>
        </div>
        <Badge className="bg-emerald-500/25 text-emerald-300 text-[8px] border-none px-1.5 py-0">
          SECURE
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between border-b border-emerald-500/10 pb-1">
          <span>Total Applications</span>
          <span className="text-foreground font-bold">1,842</span>
        </div>
        <div className="flex justify-between border-b border-emerald-500/10 pb-1">
          <span>Fee Collection Status</span>
          <span className="text-emerald-400 font-bold">98.4% Paid</span>
        </div>
        <div className="flex justify-between border-b border-emerald-500/10 pb-1">
          <span>Auto Receipts Shipped</span>
          <span className="text-foreground font-bold">1,812 / 1,842</span>
        </div>
      </div>
      {/* Decorative grid */}
      <div className="absolute bottom-2 right-2 opacity-10">
        <IconReceipt className="size-16" />
      </div>
    </div>
  );
}

// 2. Skyfall Restaurant Billing CRM Mockup
function SkyfallMockup() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-pink-950/20 border border-pink-500/20 p-4 font-mono text-[10px] text-pink-300">
      <div className="flex items-center justify-between border-b border-pink-500/20 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pink-500" />
          <span className="font-bold text-xs text-foreground">
            Skyfall Rooftop CRM
          </span>
        </div>
        <Badge className="bg-pink-500/25 text-pink-300 text-[8px] border-none px-1.5 py-0">
          LIVE SYNC
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="rounded border border-pink-500/10 p-1.5 bg-pink-950/10">
          <span className="block text-[8px] text-muted-foreground">
            TABLES ACTIVE
          </span>
          <span className="text-xs font-bold text-foreground">18 / 24</span>
        </div>
        <div className="rounded border border-pink-500/10 p-1.5 bg-pink-950/10">
          <span className="block text-[8px] text-muted-foreground">
            KOT LATENCY
          </span>
          <span className="text-xs font-bold text-pink-400">&lt; 45s</span>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 opacity-10">
        <IconLayoutDashboard className="size-16" />
      </div>
    </div>
  );
}

// 3. Radhika Jamuna Donor Ledger Mockup
function RadhikaMockup() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-violet-950/20 border border-violet-500/20 p-4 font-mono text-[10px] text-violet-300">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-violet-500" />
          <span className="font-bold text-xs text-foreground">
            Radhika Foundation API
          </span>
        </div>
        <Badge className="bg-violet-500/25 text-violet-300 text-[8px] border-none px-1.5 py-0">
          80G COMPLIANT
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between border-b border-violet-500/10 pb-1">
          <span>Donor Retention</span>
          <span className="text-violet-400 font-bold">+42% YoY</span>
        </div>
        <div className="flex justify-between border-b border-violet-500/10 pb-1">
          <span>Tax Cert Gen time</span>
          <span className="text-foreground font-bold">Instant</span>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 opacity-10">
        <IconUsers className="size-16" />
      </div>
    </div>
  );
}

// 4. Hitech Automated Operations Panel
function HitechMockup() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-sky-950/20 border border-sky-500/20 p-4 font-mono text-[10px] text-sky-300">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="font-bold text-xs text-foreground">
            Hitech Operations
          </span>
        </div>
        <Badge className="bg-sky-500/25 text-sky-300 text-[8px] border-none px-1.5 py-0">
          CI/CD OK
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between border-b border-sky-500/10 pb-1">
          <span>Daily Job Queue</span>
          <span className="text-foreground font-bold">14,280 processed</span>
        </div>
        <div className="flex justify-between border-b border-sky-500/10 pb-1">
          <span>API Response Time</span>
          <span className="text-sky-400 font-bold">120ms</span>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 opacity-10">
        <IconServer className="size-16" />
      </div>
    </div>
  );
}

const projects: Project[] = [
  {
    id: "ssdm-college",
    title: "SSDM College Admissions & Fees Portal",
    client: "SSDM College",
    category: "education",
    categoryLabel: "Academic Portal",
    description:
      "A high-security, multi-role academic portal designed to automate student semester admissions, real-time fee verifications, and instant PDF receipt generation.",
    metrics: {
      label: "Admission processing speed",
      value: "+340%",
      icon: IconTrendingUp,
    },
    features: [
      "Playwright E2E admissions verification",
      "Automated Razorpay callback reconciliations",
      "Strict role-based redirection pipeline",
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "pdfme"],
    accentColor: "text-emerald-500 dark:text-emerald-400",
    accentBg: "bg-emerald-500/10",
    mockup: SSDMCollegeMockup,
  },
  {
    id: "skyfall-restaurant",
    title: "Skyfall Rooftop Live Table & Order CRM",
    client: "Skyfall Rooftop",
    category: "hospitality",
    categoryLabel: "POS & Billing",
    description:
      "An interactive tablet CRM for rooftop table assignments, kitchen order tickets (KOT) sync, and payment reconciliation.",
    metrics: {
      label: "KOT ticket delay reduction",
      value: "92%",
      icon: IconTrendingUp,
    },
    features: [
      "Real-time dining floor active grid",
      "Instant mobile billing & SMS integration",
      "Daily profit analytics dashboard",
    ],
    techStack: ["React", "Bun", "Tailwind CSS", "WebSockets", "Node.js"],
    accentColor: "text-pink-500 dark:text-pink-400",
    accentBg: "bg-pink-500/10",
    mockup: SkyfallMockup,
  },
  {
    id: "radhika-ledger",
    title: "Radhika Foundation Donor & compliance platform",
    client: "Radhika Jamuna Foundation",
    category: "enterprise",
    categoryLabel: "CRM Ledger",
    description:
      "A specialized ledger app supporting 80G tax receipt compliance, automated donor tracking, and welfare program milestone dashboards.",
    metrics: {
      label: "Operational audit readiness",
      value: "100%",
      icon: IconTrendingUp,
    },
    features: [
      "Automated 80G tax document generations",
      "Multi-tier campaign contribution charts",
      "CSV bulk donor statement uploads",
    ],
    techStack: ["Next.js", "Bun", "Postgres", "TanStack Table"],
    accentColor: "text-violet-500 dark:text-violet-400",
    accentBg: "bg-violet-500/10",
    mockup: RadhikaMockup,
  },
  {
    id: "hitech-ops",
    title: "Hitech Operations Management Platform",
    client: "Hitech Solution Pvt Ltd",
    category: "enterprise",
    categoryLabel: "Operations Dashboard",
    description:
      "A centralized enterprise platform to manage remote team task distributions, server health monitors, and microservice audit logs.",
    metrics: {
      label: "Server configuration sync time",
      value: "-85%",
      icon: IconTrendingUp,
    },
    features: [
      "Centralized Docker log monitors",
      "Auto-scaling configuration audits",
      "High-throughput task queue managers",
    ],
    techStack: ["Next.js", "Docker", "Bun", "Prisma", "AWS"],
    accentColor: "text-sky-500 dark:text-sky-400",
    accentBg: "bg-sky-500/10",
    mockup: HitechMockup,
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

const cardFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
} satisfies Variants;

/* ─── Component ───────────────────────────────────────────────────────── */

export function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const filteredProjects = projects.filter(
    (project) =>
      activeCategory === "all" || project.category === activeCategory,
  );

  return (
    <section
      ref={ref}
      className="py-16 border-t border-border/50"
      id="portfolio"
    >
      {/* Header */}
      <motion.div
        className="mb-10 flex flex-col items-center gap-3 text-center"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headerFade}
      >
        <Badge
          variant="outline"
          className="w-fit border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          Case Studies
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          What we have built
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Explore real-world engineering solutions shipped for our enterprise,
          academic, and hospitality partners.
        </p>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {[
          { id: "all", label: "All Projects" },
          { id: "education", label: "Education" },
          { id: "hospitality", label: "Hospitality" },
          { id: "enterprise", label: "Welfare & Enterprise" },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as ProjectCategory)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 border ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const MockupComp = project.mockup;
            const MetricIcon = project.metrics.icon;
            return (
              <motion.div
                key={project.id}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardFade}
                className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  {/* Category + Client */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-none"
                    >
                      {project.categoryLabel}
                    </Badge>
                    <span className="text-[11px] font-semibold text-muted-foreground font-mono">
                      {project.client}
                    </span>
                  </div>

                  {/* Render Interactive Mockup */}
                  <div className="mb-4">
                    <MockupComp />
                  </div>

                  {/* Title + Desc */}
                  <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Metrics box */}
                  <div className="flex items-center gap-3.5 rounded-xl border border-border/40 bg-muted/10 p-3 mb-4">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${project.accentBg} ${project.accentColor}`}
                    >
                      <MetricIcon className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span
                        className={`text-base font-extrabold tracking-tight ${project.accentColor}`}
                      >
                        {project.metrics.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {project.metrics.label}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Features */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    {project.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[11px] text-muted-foreground"
                      >
                        <span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech tags + Action */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-4 mt-auto">
                  <div className="flex flex-wrap flex-1 gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="rounded border-border/60 text-[9px] px-1.5 py-0 text-muted-foreground font-mono"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    <IconArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
