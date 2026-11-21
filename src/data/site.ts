import type { Lang } from '../i18n/ui';

type L<T = string> = Record<Lang, T>;

export interface Experience {
  role: L;
  org: string;
  from: L;
  to: L;
  results: L<string[]>;
  stack: string[];
}

/** Resultados genéricos: nunca cite nomes de projetos internos do BTG Pactual. */
export const experience: Experience[] = [
  {
    role: { pt: 'Summer Intern - Automation Developer', en: 'Summer Intern - Automation Developer' },
    org: 'BTG Pactual',
    from: { pt: 'jul/2026', en: 'Jul 2026' },
    to: { pt: 'nov/2026', en: 'Nov 2026' },
    results: {
      pt: [
        'Automações de backend e rotinas agendadas que reduziram o esforço manual da operação.',
        'Projetos entregues de ponta a ponta que economizam mais de 250 horas de analistas por mês.',
        'Manutenção de mais de 15 sistemas internos: aplicações web, rotinas agendadas e robôs com Playwright.',
      ],
      en: [
        'Backend automations and scheduled jobs that cut manual operational effort.',
        'End-to-end projects that save analysts more than 250 hours a month.',
        'Maintenance of 15+ internal systems: web apps, scheduled jobs, and Playwright bots.',
      ],
    },
    stack: ['python', 'pandas', 'playwright', 'postgresql', 'fastapi', 'react', 'aws'],
  },
];

/**
 * `icon`: 'slug' do Simple Icons ou 'conjunto:nome' (logos:, lucide:). Rode `npm run icons` ao mudar.
 * Todo item precisa de ícone; para coisas sem logo, use um ícone genérico do Lucide.
 */
export interface Skill {
  name: string;
  icon: string;
}
export interface SkillGroup {
  title: L;
  items: Skill[];
}

/** Nome do arquivo em public/icons/ para um `icon`. */
export const iconFile = (icon: string) => `${icon.replace(':', '-')}.svg`;

export const skills: SkillGroup[] = [
  {
    title: { pt: 'Linguagens', en: 'Languages' },
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'SQL', icon: 'lucide:database' },
      { name: 'Rust', icon: 'rust' },
      { name: 'C', icon: 'c' },
      { name: 'C++', icon: 'cplusplus' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
    ],
  },
  {
    title: { pt: 'Dados e back-end', en: 'Data and backend' },
    items: [
      { name: 'pandas', icon: 'pandas' },
      { name: 'Polars', icon: 'polars' },
      { name: 'NumPy', icon: 'numpy' },
      { name: 'SQLAlchemy', icon: 'sqlalchemy' },
      { name: 'DuckDB', icon: 'duckdb' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Playwright', icon: 'logos:playwright' },
      { name: 'RAG', icon: 'lucide:book-search' },
    ],
  },
  {
    title: { pt: 'Ferramentas', en: 'Tools' },
    items: [
      { name: 'AWS', icon: 'logos:aws' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Azure DevOps', icon: 'devicon-plain:azuredevops' },
      { name: 'Docker', icon: 'docker' },
      { name: 'CLI', icon: 'lucide:terminal' },
      { name: 'Claude Code', icon: 'claudecode' },
      { name: 'Notion', icon: 'notion' },
      { name: 'Obsidian', icon: 'obsidian' },
    ],
  },
];

/**
 * Tecnologias dos projetos, indexadas pela tag do JSON do projeto.
 * `icon` é o slug do Simple Icons (rode `npm run icons` depois de adicionar um).
 * Tag fora desta lista aparece com o próprio texto e sem ícone.
 */
export const tech: Record<string, { label: string; icon?: string }> = {
  python: { label: 'Python', icon: 'python' },
  llm: { label: 'LLM', icon: 'lucide:brain' },
  rag: { label: 'RAG', icon: 'lucide:book-search' },
  stockfish: { label: 'Stockfish', icon: 'lucide:chess-knight' },
};
