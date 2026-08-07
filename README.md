# Trackify

**AI-powered smart scheduler**

Trackify is an AI-powered personal planning assistant that lets you describe your tasks and commitments in plain, everyday language. It automatically converts your input into a structured calendar, detects scheduling conflicts, and uses an LLM to intelligently reason about how to resolve them — rather than just flagging the clash and leaving it to you.

This project is being developed as part of **CSA3008 - AI Clinic**, Integrated M.Tech. Artificial Intelligence program, VIT Bhopal (School of Computing Science Engineering and Artificial Intelligence).

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Research Question](#research-question)
- [Domain](#domain)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Evaluation Methodology](#evaluation-methodology)
- [Related Work](#related-work)
- [Mapping to Course Outcomes](#mapping-to-course-outcomes)
- [Development Roadmap](#development-roadmap)
- [Getting Started](#getting-started)
- [Keywords](#keywords)

---

## Overview

Most calendar and to-do apps require users to manually structure their tasks — exact dates, times, durations — and don't intelligently resolve scheduling conflicts. When two commitments overlap, they simply flag the clash and leave the user to sort it out.

Trackify takes a different approach: a user types their plans in natural language (e.g. _"I have 3 assignments due this week, gym 3x, and a project meeting every Tuesday"_), and the system:

1. Parses that into structured calendar events using an LLM
2. Detects conflicts against the user's existing schedule
3. Uses the LLM to reason about priority, deadlines, and context to propose an intelligent resolution
4. Displays everything on a visual calendar with context-aware reminders

The user can accept, reject, or edit any AI-suggested resolution.

---

## Problem Statement

Existing calendar and to-do apps require users to manually structure their tasks and don't intelligently resolve scheduling conflicts — most just flag an overlap and leave the user to sort it out. This project proposes a system where a user describes their tasks and commitments in natural language, and an LLM-powered backend parses these into structured events, detects conflicts with existing commitments, and proposes intelligent resolutions — reasoning about priority, deadlines, and context, rather than applying a rigid rule.

---

## Research Question

> **Does LLM-based reasoning produce scheduling conflict resolutions that humans judge as more helpful and reasonable than a simple rule-based baseline?**

In plain terms: when two tasks clash on your calendar, is it better to let an AI think about it and suggest a smart fix — or is a simple fixed rule (e.g. "always keep the higher-priority task") just as good? Real users will rate both, blind to which system produced each suggestion.

---

## Domain

- **Primary**: Natural Language Processing (NLP) — Natural Language Understanding / structured information extraction
- **Secondary**: Applied Large Language Models (LLM reasoning), Human-Computer Interaction (evaluation methodology), Intelligent Scheduling / Automated Planning

---

## System Architecture

```
React (frontend)
   │  user types natural language input
   ▼
Express (backend)
   │  1. calls LLM API to parse text → structured JSON
   │  2. runs conflict-detection logic against existing events
   │  3. if conflict found, calls LLM again to reason about resolution
   │     (and/or runs the rule-based baseline resolver)
   ▼
Supabase (Postgres)
   │  stores users, tasks, events, conflict + resolution history
   ▼
React (frontend)
   │  renders calendar (FullCalendar.js), shows AI suggestions,
   │  lets user accept / reject / edit
```

### Components

1. **Input layer** — free-text box where the user describes tasks/commitments
2. **NLP Parsing module (LLM call #1)** — extracts task name, deadline, duration, priority, recurrence, and flexibility into structured JSON via function-calling/structured output
3. **Scheduling engine** — checks parsed tasks against the existing calendar, detects conflicts (overlaps, insufficient buffer, overloaded days)
4. **Conflict Resolution module (LLM call #2 — core novelty)** — reasons over both tasks' metadata (priority, deadline, flexibility) and proposes a resolution; user can accept/reject/edit
5. **Rule-based baseline resolver** — a simple, non-AI resolver (e.g. always deprioritize the lower-priority task) used purely for evaluation comparison
6. **Notification layer** — deadline-aware reminders with context-adjusted phrasing
7. **Calendar UI** — visual calendar (FullCalendar.js) showing the finalized schedule

---

## Tech Stack

| Layer                        | Technology                                                |
| ---------------------------- | --------------------------------------------------------- |
| Frontend                     | React + FullCalendar.js                                   |
| Backend                      | Node.js / Express                                         |
| Database & Auth              | Supabase (PostgreSQL)                                     |
| AI / LLM                     | Claude or Gemini API (structured/function-calling output) |
| Calendar sync (stretch goal) | Google Calendar API                                       |
| Notifications                | node-cron + web push / email                              |

---

## Database Schema

```sql
-- users handled by Supabase Auth automatically

tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  title text,
  deadline timestamptz,
  duration_minutes int,
  priority text,              -- 'high' | 'medium' | 'low'
  flexible boolean,
  recurrence text,            -- nullable, e.g. 'weekly'
  status text default 'scheduled', -- 'scheduled' | 'conflicted' | 'resolved'
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  created_at timestamptz default now()
);

conflicts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  task_a_id uuid references tasks,
  task_b_id uuid references tasks,
  resolution_method text,     -- 'llm' | 'rule_based'
  suggested_resolution jsonb,
  user_action text,           -- 'accepted' | 'rejected' | 'edited'
  created_at timestamptz default now()
);
```

The `conflicts` table doubles as both application data and the evaluation dataset for the research study — it logs which method produced each suggestion and how the user responded.

---

## Project Structure

```
trackify/
├── frontend/                  React + FullCalendar.js
│   └── src/
│       ├── components/
│       ├── api/                calls to Express backend
│       └── App.jsx
├── backend/                   Node/Express
│   └── src/
│       ├── routes/
│       │   ├── parse.js        NL text → structured task
│       │   ├── schedule.js     conflict detection
│       │   └── resolve.js      LLM resolution + rule-based baseline
│       ├── services/
│       │   └── llm.js          Claude/Gemini API wrapper
│       └── server.js
└── README.md
```

---

## Evaluation Methodology

1. Build a **rule-based baseline resolver** alongside the LLM-based resolver
2. Run both systems on the same set of scheduling conflict scenarios (curated + real messy natural-language inputs)
3. Measure:
   - **NLP parsing accuracy** — precision/recall on extracted fields (deadline, duration, priority) against a hand-labeled ground-truth set
   - **Human evaluation** — blind ratings (1–5 scale) from ~10–15 judges on the helpfulness/reasonableness of each system's conflict resolutions, without revealing which system produced which suggestion
   - **(Optional)** task follow-through rate — whether users actually adopted the suggested schedule

---

## Related Work

**"Robust Planning with Compound LLM Architectures: An LLM-Modulo Approach"** (Gundawar et al., 2024, arXiv:2411.14484) evaluates a framework where an LLM proposes a solution and a bank of external critics verifies it against hard constraints, re-prompting the LLM with feedback until the solution passes or a budget is exceeded. Tested across four scheduling domains (including Calendar Scheduling), it shows significant accuracy gains from this critic-verification loop.

**Gap this project addresses:**

- Their calendar scheduling benchmark uses pre-structured, clean constraints — not free-form, informal natural language input
- Their critics check hard constraints only (binary correctness) — no soft/preference-based reasoning (e.g. "which task should yield")
- Their evaluation is fully automated — no human judgment of suggestion quality

Trackify's contribution: free-form NL parsing of messy personal input, soft-constraint/preference-based conflict resolution, and a human evaluation component comparing LLM reasoning against a rule-based baseline.

---

## Mapping to Course Outcomes

| CO                                                                      | How this project addresses it                                                                                                                            |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CO1 — Identify the best feature for an application                      | Core feature chosen: NLP parsing + intelligent conflict resolution                                                                                       |
| CO2 — Apply relevant technologies with social responsibility and ethics | Transparent AI reasoning, user retains final control (accept/reject/edit suggestions), attention to privacy of personal schedule data sent to an LLM API |
| CO3 — Publish in a Scopus-indexed Conference/Journal                    | NLP/LLM-reasoning evaluation studies are a well-established, publishable format in applied AI and NLP venues                                             |

---

## Development Roadmap

| Phase                                                         | Review         | Deliverable                                  |
| ------------------------------------------------------------- | -------------- | -------------------------------------------- |
| Problem statement, literature review, architecture diagram    | Review 0       | Proposal only, no scoring                    |
| Working NLP parser + basic DB storage                         | Review 1 (25%) | Core parsing demo                            |
| Calendar UI + scheduling + conflict detection + notifications | Review 2 (35%) | Full working app, evaluation dataset started |
| Evaluation study, paper draft, submission                     | Review 3 (40%) | Polished app + submitted/published paper     |

**Suggested build order:**

1. Supabase setup (schema above, auth enabled)
2. Express `/parse` endpoint — free text → structured JSON (highest-risk piece, build first)
3. Basic React UI — text input + list view of parsed tasks
4. Conflict detection logic — overlap checks against stored tasks
5. Rule-based resolver — build early, needed for the comparison study
6. LLM resolver — the core novel component
7. Calendar UI (FullCalendar.js) — visual layer once logic works
8. Notifications — lowest priority, build last

---

## Getting Started

```bash
# clone the repo
git clone <repo-url>
cd trackify

# backend setup
cd backend
npm install
cp .env.example .env    # add SUPABASE_URL, SUPABASE_KEY, LLM_API_KEY
npm run dev

# frontend setup
cd ../frontend
npm install
npm run dev
```

Environment variables required:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
LLM_API_KEY=          # Claude or Gemini API key
LLM_PROVIDER=claude   # or "gemini"
```

---

## Keywords

Large Language Models; Natural Language Processing; Intelligent Scheduling; Conflict Resolution; Human-AI Interaction; Prompt Engineering; Structured Information Extraction
