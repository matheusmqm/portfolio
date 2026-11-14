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

export const about: {
  text: L<string[]>;
  facts: { key: 'formation' | 'languages' | 'interests'; value: L }[];
} = {
  text: {
    pt: [
      'Estudo Engenharia da Computação no IFCE, em Fortaleza, e trabalho com automação no BTG Pactual.',
      'Gosto de sistemas que resolvem um problema real, de dados bem tratados e de finanças quantitativas.',
    ],
    en: [
      'I study Computer Engineering at IFCE in Fortaleza and work on automation at BTG Pactual.',
      'I like systems that solve a real problem, well-handled data, and quantitative finance.',
    ],
  },
  facts: [
    {
      key: 'formation',
      value: { pt: 'Engenharia da Computação, IFCE · 2025–2029', en: 'Computer Engineering, IFCE · 2025–2029' },
    },
    { key: 'languages', value: { pt: 'Português e inglês', en: 'Portuguese and English' } },
    {
      key: 'interests',
      value: {
        pt: 'Automação, engenharia de dados, finanças quantitativas',
        en: 'Automation, data engineering, quantitative finance',
      },
    },
  ],
};
