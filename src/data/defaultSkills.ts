import type { Skill } from '../types/skill';

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'skill-appsec-auditor',
    title: 'Zero-Day & AppSec Vulnerability Auditor',
    description: 'Systematic static and semantic security audit for source code, scanning for OWASP Top 10, CWE violations, memory leaks, and injection points.',
    category: 'Security & Auditing',
    skillType: 'system_instruction',
    level: 'Expert',
    models: ['Gemini 1.5/2.0', 'Claude 3.5 Sonnet', 'GPT-4o'],
    tags: ['Security', 'OWASP', 'Code Audit', 'PenTest', 'CWE'],
    author: 'AppSec Vault',
    isFavorite: true,
    usageCount: 42,
    rating: 5,
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-11-02T14:20:00Z',
    variables: [
      { name: 'target_language', label: 'Target Language / Framework', defaultValue: 'TypeScript & Node.js', description: 'Tech stack of the audited code' },
      { name: 'threat_model', label: 'Threat Model / Context', defaultValue: 'Public API handling sensitive user credentials and payment tokens', description: 'Contextual risk profile' },
      { name: 'code_snippet', label: 'Code Snippet', defaultValue: '// Paste target code or endpoint here', description: 'Code to evaluate' }
    ],
    content: `You are an elite Principal Application Security Engineer and White-Hat Penetration Tester.
Your mission is to perform a rigorous security audit on the following {{target_language}} codebase.

### Context & Threat Model:
{{threat_model}}

### Analysis Scope & Directives:
1. Identify all OWASP Top 10 vulnerabilities (Injection, Broken Auth, SSRF, Deserialization, Path Traversal, Race Conditions).
2. For every vulnerability found:
   - Provide a Severity rating (Critical, High, Medium, Low) with CWE ID.
   - Explain the exact exploit vector and impact scenario.
   - Provide the remediated, drop-in replacement code snippet.
3. Validate sanitization, input validation boundaries, timing attacks, and secret leakage risks.

### Code under audit:
\`\`\`
{{code_snippet}}
\`\`\`

Format your response with an Executive Risk Score (0-100), detailed findings table, and patched code blocks.`
  },
  {
    id: 'skill-senior-refactorer',
    title: 'Senior Code Refactoring & SOLID Modernizer',
    description: 'Transforms messy, high-cyclomatic-complexity code into clean, modular, testable, and idiomatic modern code following clean architecture patterns.',
    category: 'Coding & Architecture',
    skillType: 'prompt',
    level: 'Advanced',
    models: ['Universal', 'Gemini 1.5/2.0', 'Claude 3.5 Sonnet'],
    tags: ['Refactoring', 'Clean Code', 'SOLID', 'Design Patterns', 'DRY'],
    author: 'Architecture Guild',
    isFavorite: true,
    usageCount: 78,
    rating: 5,
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-11-08T16:45:00Z',
    variables: [
      { name: 'language', label: 'Programming Language', defaultValue: 'TypeScript', description: 'Target language' },
      { name: 'code', label: 'Target Code to Refactor', defaultValue: 'function processOrder(order) { ... }', description: 'Messy or legacy code' },
      { name: 'primary_goal', label: 'Primary Goal', defaultValue: 'Decompose monolithic function, enhance testability and decouple I/O', description: 'Refactoring objective' }
    ],
    content: `You are a Staff Software Architect specializing in domain-driven design and clean architecture in {{language}}.

### Objective:
{{primary_goal}}

### Guardrails & Principles:
- Preserve 100% of the functional behavior and edge-case contracts.
- Apply SOLID principles: Single Responsibility, Open-Closed, and Dependency Inversion.
- Replace nested condition pyramids with early guard clauses or pattern matching.
- Introduce descriptive naming and type safety.

### Target Code:
\`\`\`
{{code}}
\`\`\`

Deliver your output as:
1. **Architectural Diagnosis**: Brief 3-bullet breakdown of design anti-patterns present.
2. **Refactored Code**: Fully commented, idiomatic, clean implementation.
3. **Key Improvements**: What changed and why it scales better.`
  },
  {
    id: 'skill-react-agent-loop',
    title: 'Autonomous ReAct Agent Orchestrator',
    description: 'A robust Thought-Action-Observation multi-step reasoning prompt that guides an AI agent through complex tasks with self-correction.',
    category: 'Agentic Workflows',
    skillType: 'agent_workflow',
    level: 'Expert',
    models: ['Antigravity / Cursor', 'Gemini 1.5/2.0', 'Claude 3.5 Sonnet'],
    tags: ['Agent', 'ReAct', 'Tool Calling', 'Autonomy', 'Self-Correction'],
    author: 'Agent Lab',
    isFavorite: true,
    usageCount: 65,
    rating: 5,
    createdAt: '2026-10-01T08:15:00Z',
    updatedAt: '2026-11-09T10:00:00Z',
    variables: [
      { name: 'user_goal', label: 'User Goal', defaultValue: 'Analyze customer churn CSV, find patterns, and write an automated retention email draft', description: 'High level agent goal' },
      { name: 'available_tools', label: 'Available Tools', defaultValue: 'read_file(path), run_command(cmd), write_file(path, content)', description: 'Tools the agent can call' }
    ],
    content: `You operate as an autonomous problem-solving agent executing via the ReAct (Reasoning + Acting) loop.

### Available Tools:
{{available_tools}}

### Task:
{{user_goal}}

### Operating Loop Protocol:
For each step, you must format your response strictly as follows:

Thought: Break down what you know, your hypothesis, and what tool call is needed next.
Action: {"tool": "<tool_name>", "args": { ... }}
Observation: [The environment will deliver the result of your action here]
... (Repeat Thought / Action / Observation until objective is met)

Final Answer: When you have verified all steps, output your final result clearly with supporting evidence.

Rules:
- Never assume a tool succeeded without inspecting the Observation.
- If an action fails, inspect the error in Thought, formulate an alternative, and re-try.`
  },
  {
    id: 'skill-mcp-tool-architect',
    title: 'Model Context Protocol (MCP) Tool Spec Generator',
    description: 'Generates JSON Schema compliant Model Context Protocol (MCP) tool declarations with complete input schemas and type safety.',
    category: 'Agentic Workflows',
    skillType: 'tool_mcp',
    level: 'Intermediate',
    models: ['Universal', 'Antigravity / Cursor', 'Claude 3.5 Sonnet'],
    tags: ['MCP', 'JSON Schema', 'Tool Calling', 'API Spec'],
    author: 'Protocol Guild',
    isFavorite: false,
    usageCount: 31,
    rating: 4,
    createdAt: '2026-10-18T14:00:00Z',
    updatedAt: '2026-11-05T12:00:00Z',
    variables: [
      { name: 'service_name', label: 'Service / Tool Name', defaultValue: 'git_repository_inspector', description: 'Name of the tool' },
      { name: 'capabilities', label: 'Tool Capabilities', defaultValue: 'fetch branches, diff commits, inspect file history', description: 'What this tool does' }
    ],
    content: `You are an expert in the Model Context Protocol (MCP) specification standard.
Create a production-ready MCP tool definition for: "{{service_name}}".

### Capabilities Required:
{{capabilities}}

Produce:
1. Complete MCP JSON Tool Declaration conforming to JSON Schema Draft 7.
2. Clear description explaining to the LLM exactly when to invoke this tool and when NOT to invoke it.
3. Strongly-typed parameter definitions with required vs optional attributes, enums, and bounds.
4. An example input payload.`
  },
  {
    id: 'skill-antigravity-skill-md',
    title: 'Antigravity SKILL.md Specification Generator',
    description: 'Generates standard SKILL.md files for Antigravity AI agents, including frontmatter metadata, triggers, workflow guides, and script structures.',
    category: 'Prompt Engineering',
    skillType: 'system_instruction',
    level: 'Intermediate',
    models: ['Antigravity / Cursor', 'Gemini 1.5/2.0'],
    tags: ['SKILL.md', 'Antigravity', 'Agent Skills', 'Automation'],
    author: 'Antigravity Core',
    isFavorite: true,
    usageCount: 54,
    rating: 5,
    createdAt: '2026-10-25T13:20:00Z',
    updatedAt: '2026-11-09T18:10:00Z',
    variables: [
      { name: 'skill_name', label: 'Skill Name', defaultValue: 'database-migration-helper', description: 'Slugified skill name' },
      { name: 'skill_purpose', label: 'Skill Purpose & Scope', defaultValue: 'Guides schema migrations, generates rollback scripts, and verifies foreign key integrity across PostgreSQL databases', description: 'What the skill handles' }
    ],
    content: `Generate a fully compliant Antigravity SKILL.md file for a skill named "{{skill_name}}".

### Purpose:
{{skill_purpose}}

Structure the output as a clean markdown file with:
---
name: {{skill_name}}
description: Concise one-sentence summary for agent trigger matching
version: 1.0.0
---

Include sections:
1. **Overview & Scope** (when to activate this skill)
2. **Step-by-Step Workflow** (executable instructions for the agent)
3. **Safety & Verification Checklist** (validation before finishing)
4. **Example Invocations & Shell Commands**`
  },
  {
    id: 'skill-data-storyteller',
    title: 'Executive Data Storyteller & SQL-to-Insights',
    description: 'Transforms raw database tables, metrics, and SQL query results into compelling executive narratives with actionable business recommendations.',
    category: 'Data & Analytics',
    skillType: 'prompt',
    level: 'Intermediate',
    models: ['Gemini 1.5/2.0', 'GPT-4o', 'Claude 3.5 Sonnet'],
    tags: ['Data Viz', 'Analytics', 'SQL', 'Executive Summary', 'KPIs'],
    author: 'BI Analytics',
    isFavorite: false,
    usageCount: 29,
    rating: 4,
    createdAt: '2026-09-12T16:00:00Z',
    updatedAt: '2026-10-30T09:15:00Z',
    variables: [
      { name: 'audience', label: 'Target Audience', defaultValue: 'CFO and VP of Product', description: 'Stakeholders reading the report' },
      { name: 'raw_data', label: 'Data / Query Results', defaultValue: 'Monthly active users, retention cohorts, MRR breakdown', description: 'Raw metrics or tables' }
    ],
    content: `You are an Executive Business Intelligence Director. Translate the following data into a high-impact executive briefing for {{audience}}.

### Raw Data / Results:
\`\`\`
{{raw_data}}
\`\`\`

Format requirements:
- **TL;DR Headline**: 1 sentence high-impact takeaway.
- **Top 3 Findings**: Clear insights backed by concrete percentage changes or dollar metrics.
- **Root Cause & Correlation**: What drove these movements?
- **Strategic Recommendations**: 3 prioritized action items (immediate, 30-day, quarterly).`
  },
  {
    id: 'skill-tdd-test-matrix',
    title: 'Comprehensive Unit & Edge Case Test Matrix (TDD)',
    description: 'Generates exhaustive unit, integration, boundary, and edge-case test matrices using modern frameworks (Vitest, Jest, PyTest).',
    category: 'Coding & Architecture',
    skillType: 'prompt',
    level: 'Advanced',
    models: ['Universal', 'Gemini 1.5/2.0', 'Claude 3.5 Sonnet'],
    tags: ['Testing', 'TDD', 'Vitest', 'Jest', 'PyTest', 'Edge Cases'],
    author: 'QA Guild',
    isFavorite: false,
    usageCount: 38,
    rating: 5,
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-11-01T11:30:00Z',
    variables: [
      { name: 'test_framework', label: 'Test Framework', defaultValue: 'Vitest + Testing Library', description: 'Testing library or framework' },
      { name: 'target_component', label: 'Target Function or Component', defaultValue: 'calculateTaxAndDiscounts(cart, userProfile)', description: 'Function or module to test' }
    ],
    content: `You are a Principal Software Quality Engineer. Construct an exhaustive test suite using {{test_framework}} for:

\`\`\`
{{target_component}}
\`\`\`

Ensure you cover:
1. **Happy Paths**: Standard expected inputs and behavior.
2. **Boundary & Corner Cases**: Empty states, min/max values, 0, null, undefined, NaN, float inaccuracies.
3. **Failure & Error Modes**: Network drops, invalid input types, thrown exceptions.
4. **Mocking Boundaries**: Clear isolation of external side effects.

Provide the complete test suite ready to copy-paste.`
  },
  {
    id: 'skill-few-shot-metaprompt',
    title: 'Few-Shot Metaprompt Optimizer & Delimiter Stylist',
    description: 'Analyzes weak or vague user prompts and rewrites them into structured, high-accuracy production metaprompts with delimiters and few-shot examples.',
    category: 'Prompt Engineering',
    skillType: 'prompt',
    level: 'Expert',
    models: ['Universal', 'Gemini 1.5/2.0', 'Claude 3.5 Sonnet'],
    tags: ['Metaprompting', 'Few-Shot', 'Delimiters', 'Prompt Tuning'],
    author: 'Prompt Foundry',
    isFavorite: true,
    usageCount: 88,
    rating: 5,
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-11-07T14:10:00Z',
    variables: [
      { name: 'rough_prompt', label: 'Rough / Draft Prompt', defaultValue: 'Write me a prompt to generate blog posts from YouTube transcripts', description: 'Your initial raw prompt idea' },
      { name: 'expected_output_format', label: 'Desired Output Format', defaultValue: 'Markdown with SEO frontmatter, headers, key quotes, and meta description', description: 'Desired output format' }
    ],
    content: `You are an elite Metaprompt Engineer. Your job is to take a rough prompt concept and engineer a world-class, production-grade LLM prompt.

### User Draft Idea:
"{{rough_prompt}}"

### Expected Output Specification:
{{expected_output_format}}

Apply prompt engineering best practices:
- Clear role and persona definition with domain expertise.
- Explicit XML or Markdown delimiter tags (<context>, <instructions>, <constraints>, <output_format>).
- 2 high-quality synthetic few-shot input/output examples to anchor the LLM's distribution.
- Chain-of-thought scratchpad directive before final answer.
- Strict negative constraints ("DO NOT do X").

Output the final, polished system prompt ready for deployment.`
  },
  {
    id: 'skill-rgpd-appsec-fr',
    title: 'Auditeur de Sécurité Applicative & Conformité RGPD',
    description: 'Audit méthodique de code source vérifiant la conformité au RGPD (anonymisation, consentement, rétention) et la protection contre le Top 10 OWASP.',
    category: 'Security & Auditing',
    skillType: 'system_instruction',
    level: 'Expert',
    models: ['Gemini 1.5/2.0', 'Claude 3.5 Sonnet', 'GPT-4o'],
    tags: ['Sécurité', 'RGPD', 'OWASP', 'Audit', 'Protection des Données'],
    author: 'Vault Cybersécurité FR',
    isFavorite: true,
    usageCount: 56,
    rating: 5,
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-11-09T15:30:00Z',
    variables: [
      { name: 'langage_cible', label: 'Langage / Framework Cible', defaultValue: 'TypeScript & Fastify / Express', description: 'Stack technique analysée' },
      { name: 'donnees_sensibles', label: 'Données Personnelles Manipulées', defaultValue: 'Adresses e-mail, identifiants bancaires, coordonnées GPS', description: 'Types de données traitées' },
      { name: 'code_source', label: 'Extrait de Code à Auditer', defaultValue: '// Collez votre contrôleur d\'API ou service de traitement ici', description: 'Code sous analyse' }
    ],
    content: `Vous êtes un Expert Principal en Sécurité Logicielle et Délégué à la Protection des Données (DPO technique).
Votre mission consiste à réaliser un audit de conformité et de sécurité exhaustif sur le code source {{langage_cible}} ci-dessous.

### Périmètre & Données Personnelles :
{{donnees_sensibles}}

### Directives d'Analyse :
1. **Conformité RGPD / Privacy by Design** :
   - Vérifier la minimisation des données et l'absence de journalisation en clair d'identifiants personnels (logs applicatifs).
   - Valider la pseudonymisation / hachage salé des données sensibles.
   - Contrôler les mécanismes de droit à l'effacement et de durée de rétention.
2. **Vulnérabilités OWASP Top 10** :
   - Identifier les injections (SQL, NoSQL, XSS), défauts d'authentification et autorisations défaillantes (BOLA/IDOR).
3. **Format du Bilan** :
   - Tableau synthétique des risques avec sévérité (Critique, Élevé, Moyen, Faible).
   - Code de remédiation direct prêt à l'emploi.

### Code Source Audité :
\`\`\`
{{code_source}}
\`\`\``
  },
  {
    id: 'skill-prompt-architect-fr',
    title: 'Architecte de Prompts Structurés & Few-Shot',
    description: 'Transforme une idée de prompt brute en un prompt système de production francophone avec balises de délimitation, exemples synthétiques et garde-fous.',
    category: 'Prompt Engineering',
    skillType: 'prompt',
    level: 'Advanced',
    models: ['Universal', 'Gemini 1.5/2.0', 'Claude 3.5 Sonnet'],
    tags: ['Ingénierie de Prompts', 'Few-Shot', 'Production', 'Français'],
    author: 'Atelier Prompt FR',
    isFavorite: false,
    usageCount: 47,
    rating: 5,
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-11-08T11:20:00Z',
    variables: [
      { name: 'objectif_prompt', label: 'Objectif du Prompt', defaultValue: 'Générer des fiches de synthèse technique à partir de spécifications RFC', description: 'But de la tâche' },
      { name: 'format_attendu', label: 'Format de Sortie Attendu', defaultValue: 'Tableau récapitulatif, points clés décisionnels et extrait de code d\'exemple', description: 'Structure finale' }
    ],
    content: `Vous êtes un Ingénieur Spécialiste en Ingénierie de Prompts (Prompt Engineering) pour modèles de langage avancés.
Transformez la demande suivante en un prompt système de haute précision en langue française.

### Demande Brute :
"{{objectif_prompt}}"

### Spécification de Sortie :
{{format_attendu}}

### Règles de Structuration à Appliquer :
- Définition explicite du rôle et des compétences expertes.
- Délimiteurs clairs (<contexte>, <instructions>, <contraintes>, <format_sortie>).
- Intégration de deux exemples concrets d'entrée/sortie (Few-Shot) pour stabiliser le comportement du LLM.
- Directives d'auto-évaluation et clauses d'exclusion strictes.

Fournissez le prompt système finalisé, prêt à être copié et exécuté.`
  }
];
