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
    role: { pt: 'Automation Developer', en: 'Automation Developer' },
    org: 'BTG Pactual',
    from: { pt: 'jul/2026', en: 'Jul 2026' },
    to: { pt: 'hoje', en: 'present' },
    results: {
      pt: [
        'Automações de backend e rotinas agendadas que reduzem o esforço manual da operação.',
        'Projetos entregues de ponta a ponta que economizam mais de 250 horas de analistas por mês.',
        'Manutenção de mais de 15 sistemas internos: aplicações web, rotinas agendadas e robôs com Playwright.',
      ],
      en: [
        'Backend automations and scheduled jobs that cut manual operational effort.',
        'End-to-end projects that save analysts more than 250 hours a month.',
        'Maintenance of 15+ internal systems: web apps, scheduled jobs, and Playwright bots.',
      ],
    },
    stack: ['python', 'pandas', 'playwright', 'postgresql', 'fastapi', 'react', 'aws-lambda', 's3'],
  },
];

export interface ProfileFact {
  key: 'basedIn' | 'now' | 'degree' | 'focus';
  value: L;
}

export const profile: ProfileFact[] = [
  { key: 'basedIn', value: { pt: 'Fortaleza, CE, Brasil', en: 'Fortaleza, CE, Brazil' } },
  { key: 'now', value: { pt: 'Automation Developer, BTG Pactual', en: 'Automation Developer, BTG Pactual' } },
  { key: 'degree', value: { pt: 'Engenharia da Computação, IFCE', en: 'Computer Engineering, IFCE' } },
  {
    key: 'focus',
    value: {
      pt: 'Automação, engenharia de dados, finanças quantitativas',
      en: 'Automation, data engineering, quantitative finance',
    },
  },
];

/** `icon` é o slug do Simple Icons; sem ele, a skill aparece só com o texto. */
export interface Skill {
  name: string;
  icon?: string;
}
export interface SkillGroup {
  title: L;
  items: Skill[];
}

/** PROVISÓRIO: montado a partir da stack da experiência e das tags dos projetos. Revise. */
export const skills: SkillGroup[] = [
  {
    title: { pt: 'Linguagens', en: 'Languages' },
    items: [{ name: 'Python', icon: 'python' }, { name: 'SQL' }],
  },
  {
    title: { pt: 'Dados e backend', en: 'Data and backend' },
    items: [
      { name: 'pandas', icon: 'pandas' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Playwright', icon: 'playwright' },
      { name: 'RAG' },
    ],
  },
  {
    title: { pt: 'Ferramentas e nuvem', en: 'Tools and cloud' },
    items: [
      { name: 'React', icon: 'react' },
      { name: 'AWS Lambda', icon: 'awslambda' },
      { name: 'Amazon S3', icon: 'amazons3' },
      { name: 'Git', icon: 'git' },
      { name: 'Docker', icon: 'docker' },
    ],
  },
];
