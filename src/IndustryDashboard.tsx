'use client';

import { useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Factory,
  Info,
  Lightbulb,
  MapPin,
  Menu,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  X,
} from 'lucide-react';
import styles from './IndustryDashboard.module.css';

type ViewId = 'overview' | 'profile' | 'hour' | 'media' | 'handoff';
type AudienceId = 'industry' | 'support' | 'all';

type Filters = {
  city: 'Grande Goiânia' | 'São Paulo' | 'Belo Horizonte';
  disability: 'Todas' | 'Sim' | 'Não';
  apprentice: 'Todos' | 'Sim' | 'Não';
  ageRange: 'Todas' | '14 a 17 anos' | '18 a 24 anos' | '25 a 34 anos' | '35 anos ou mais';
  accessibility: 'Todas' | 'Acessibilidade física' | 'Comunicação acessível' | 'Tecnologia assistiva';
  professionalMoment: 'Em busca de oportunidade' | 'Em expansão' | 'Consolidado';
  shift: 'Todos os turnos' | '1º turno' | '2º turno' | '3º turno';
  media: 'TV' | 'Rádio' | 'TV + Rádio';
};

type ScenarioId = 'tv' | 'radio' | 'mix';

type MediaPlacement = {
  name: string;
  channel: string;
  affinity: number;
};

type AudiencePreset = {
  id: AudienceId;
  title: string;
  subtitle: string;
  reach: number;
  affinity: number;
  response: number;
  hourly: number[];
  media: MediaPlacement[];
  icon: LucideIcon;
};

type Scenario = {
  id: ScenarioId;
  label: string;
  summary: string;
  investment: number;
  frequency: string;
  impactScore: number;
  impactLabel: string;
  reachMultiplier: number;
};

const INITIAL_FILTERS: Filters = {
  city: 'Grande Goiânia',
  disability: 'Todas',
  apprentice: 'Todos',
  ageRange: 'Todas',
  accessibility: 'Todas',
  professionalMoment: 'Em busca de oportunidade',
  shift: 'Todos os turnos',
  media: 'TV',
};

const NAV_ITEMS: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Visão geral', icon: Target },
  { id: 'profile', label: 'Perfil & Hábitos', icon: UsersRound },
  { id: 'hour', label: 'Hora a hora', icon: Clock3 },
  { id: 'media', label: 'Plano de mídia', icon: BarChart3 },
  { id: 'handoff', label: 'Encaminhamento', icon: ArrowRight },
];

const PLATFORM_STEPS: Array<{ n: number; label: string; view: ViewId }> = [
  { n: 1, label: 'Campanha', view: 'overview' },
  { n: 2, label: 'Configuração', view: 'overview' },
  { n: 3, label: 'Público-Alvo', view: 'profile' },
  { n: 4, label: 'Finalização', view: 'handoff' },
];

const AUDIENCE_PRESETS: Record<AudienceId, AudiencePreset> = {
  industry: {
    id: 'industry',
    title: 'Profissional da indústria',
    subtitle: 'Busca oportunidades',
    reach: 18400,
    affinity: 4820,
    response: 26.2,
    hourly: [42, 63, 78, 71, 58, 49, 67, 59, 43, 38, 52, 70, 86, 82],
    media: [
      { name: 'Rádio Sucesso', channel: '96,1 FM · Rádio', affinity: 31 },
      { name: 'Rádio Executiva', channel: '92,7 FM · Rádio', affinity: 24 },
      { name: 'Anhanguera / Globo', channel: 'TV · TV aberta', affinity: 19 },
      { name: 'Serra Dourada / SBT', channel: 'TV · TV aberta', affinity: 16 },
    ],
    icon: Factory,
  },
  support: {
    id: 'support',
    title: 'Rede de apoio',
    subtitle: 'Família e lideranças',
    reach: 24700,
    affinity: 5640,
    response: 22.8,
    hourly: [35, 48, 61, 67, 64, 52, 57, 62, 50, 44, 58, 74, 81, 76],
    media: [
      { name: 'Rádio Executiva', channel: '92,7 FM · Rádio', affinity: 29 },
      { name: 'Rádio Sucesso', channel: '96,1 FM · Rádio', affinity: 27 },
      { name: 'Serra Dourada / SBT', channel: 'TV · TV aberta', affinity: 21 },
      { name: 'Anhanguera / Globo', channel: 'TV · TV aberta', affinity: 17 },
    ],
    icon: UsersRound,
  },
  all: {
    id: 'all',
    title: 'Audiência total',
    subtitle: 'Todos os respondentes',
    reach: 68200,
    affinity: 9810,
    response: 14.4,
    hourly: [39, 52, 64, 68, 59, 47, 61, 56, 44, 41, 57, 73, 80, 75],
    media: [
      { name: 'Anhanguera / Globo', channel: 'TV · TV aberta', affinity: 28 },
      { name: 'Rádio Sucesso', channel: '96,1 FM · Rádio', affinity: 25 },
      { name: 'Serra Dourada / SBT', channel: 'TV · TV aberta', affinity: 22 },
      { name: 'Rádio Executiva', channel: '92,7 FM · Rádio', affinity: 18 },
    ],
    icon: Target,
  },
};

const CITY_OPTIONS: Filters['city'][] = ['Grande Goiânia', 'São Paulo', 'Belo Horizonte'];
const DISABILITY_OPTIONS: Filters['disability'][] = ['Todas', 'Sim', 'Não'];
const APPRENTICE_OPTIONS: Filters['apprentice'][] = ['Todos', 'Sim', 'Não'];
const AGE_RANGE_OPTIONS: Filters['ageRange'][] = [
  'Todas',
  '14 a 17 anos',
  '18 a 24 anos',
  '25 a 34 anos',
  '35 anos ou mais',
];
const ACCESSIBILITY_OPTIONS: Filters['accessibility'][] = [
  'Todas',
  'Acessibilidade física',
  'Comunicação acessível',
  'Tecnologia assistiva',
];
const MOMENT_OPTIONS: Filters['professionalMoment'][] = [
  'Em busca de oportunidade',
  'Em expansão',
  'Consolidado',
];
const SHIFT_OPTIONS: Filters['shift'][] = ['Todos os turnos', '1º turno', '2º turno', '3º turno'];
const MEDIA_OPTIONS: Filters['media'][] = ['TV', 'Rádio', 'TV + Rádio'];

const SCENARIOS: Record<ScenarioId, Scenario> = {
  tv: {
    id: 'tv',
    label: 'TV',
    summary: 'Cobertura visual e presença de marca',
    investment: 38400,
    frequency: '8 inserções / semana',
    impactScore: 62,
    impactLabel: 'boa cobertura',
    reachMultiplier: 0.93,
  },
  radio: {
    id: 'radio',
    label: 'Rádio',
    summary: 'Frequência e presença nos deslocamentos',
    investment: 26800,
    frequency: '18 inserções / semana',
    impactScore: 58,
    impactLabel: 'alta repetição',
    reachMultiplier: 0.86,
  },
  mix: {
    id: 'mix',
    label: 'Mix recomendado',
    summary: 'Cobertura da TV com frequência do rádio',
    investment: 52700,
    frequency: '14 inserções / semana',
    impactScore: 76,
    impactLabel: 'maior conexão',
    reachMultiplier: 1,
  },
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

function getCityMultiplier(city: Filters['city']): number {
  return {
    'Grande Goiânia': 1,
    'São Paulo': 1.28,
    'Belo Horizonte': 0.84,
  }[city];
}

function getFilterMultiplier(filters: Filters): number {
  const cityMultiplier = getCityMultiplier(filters.city);
  const disabilityMultiplier = {
    Todas: 1,
    Sim: 0.74,
    Não: 0.9,
  }[filters.disability];
  const apprenticeMultiplier = {
    Todos: 1,
    Sim: 0.72,
    Não: 0.96,
  }[filters.apprentice];
  const ageRangeMultiplier = {
    Todas: 1,
    '14 a 17 anos': 0.62,
    '18 a 24 anos': 0.95,
    '25 a 34 anos': 1.05,
    '35 anos ou mais': 0.88,
  }[filters.ageRange];
  const accessibilityMultiplier = {
    Todas: 1,
    'Acessibilidade física': 0.82,
    'Comunicação acessível': 0.94,
    'Tecnologia assistiva': 0.76,
  }[filters.accessibility];
  const momentMultiplier = {
    'Em busca de oportunidade': 1,
    'Em expansão': 1.1,
    Consolidado: 0.96,
  }[filters.professionalMoment];
  const shiftMultiplier = {
    'Todos os turnos': 1,
    '1º turno': 1.05,
    '2º turno': 0.88,
    '3º turno': 0.7,
  }[filters.shift];
  const mediaMultiplier = {
    TV: 1,
    Rádio: 0.88,
    'TV + Rádio': 1.16,
  }[filters.media];

  return cityMultiplier * disabilityMultiplier * apprenticeMultiplier * ageRangeMultiplier * accessibilityMultiplier * momentMultiplier * shiftMultiplier * mediaMultiplier;
}

function getInitials(): string {
  return 'EM';
}

export default function IndustryDashboard() {
  const [selectedAudience, setSelectedAudience] = useState<AudienceId>('industry');
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('mix');
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [selectedHour, setSelectedHour] = useState(18);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const sectionRefs = useRef<Record<ViewId, HTMLElement | null>>({
    overview: null,
    profile: null,
    hour: null,
    media: null,
    handoff: null,
  });

  const baseAudience = AUDIENCE_PRESETS[selectedAudience];
  const audience = useMemo(() => {
    const multiplier = getFilterMultiplier(filters);
    const reach = Math.round(baseAudience.reach * multiplier);
    const affinity = Math.round(baseAudience.affinity * (0.9 + multiplier * 0.1));
    const response = Math.min(38, Math.max(8, baseAudience.response * (0.95 + multiplier * 0.08)));
    const hourly = baseAudience.hourly.map((value) => Math.round(value * (0.92 + multiplier * 0.08)));

    return {
      ...baseAudience,
      reach,
      affinity,
      response,
      hourly,
      media: baseAudience.media.map((placement) => ({
        ...placement,
        affinity: Math.min(48, Math.max(12, Math.round(placement.affinity * (0.9 + multiplier * 0.1)))),
      })),
    };
  }, [baseAudience, filters]);

  const maxHourly = Math.max(...audience.hourly);
  const bestHour = 6 + audience.hourly.indexOf(maxHourly);
  const selectedScenarioInfo = SCENARIOS[selectedScenario];
  const scenarioInvestment = Math.round(selectedScenarioInfo.investment * getCityMultiplier(filters.city));
  const scenarioReach = Math.round(audience.reach * selectedScenarioInfo.reachMultiplier);
  const connectionProgress = Math.min(94, Math.round(61 + audience.response));
  const campaignMessage = filters.shift === 'Todos os turnos'
    ? 'Encontre uma oportunidade na indústria. Saiba mais.'
    : `No ${filters.shift.toLowerCase()}, encontre uma oportunidade. Saiba mais.`;
  const recommendationReason = `${baseAudience.title} concentra o melhor sinal às ${String(bestHour).padStart(2, '0')}h na praça ${filters.city}. O ${selectedScenarioInfo.label.toLowerCase()} combina ${selectedScenarioInfo.summary.toLowerCase()}.`;
  const profileSummary = `PCD: ${filters.disability} · Jovem Aprendiz: ${filters.apprentice} · Faixa: ${filters.ageRange}`;
  const activePlatformStep = activeView === 'handoff' ? 4 : activeView === 'profile' ? 3 : activeView === 'hour' || activeView === 'media' ? 2 : 1;

  function navigateTo(view: ViewId) {
    setActiveView(view);
    setMobileNavOpen(false);
    window.requestAnimationFrame(() => {
      sectionRefs.current[view]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function updateFilter<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPlanReady(false);
    setSummaryCopied(false);
    setNotice(null);
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setPlanReady(false);
    setSummaryCopied(false);
    setNotice('Segmentação restaurada para o cenário demonstrativo.');
  }

  function handleRecommendation() {
    setNotice(`Recomendação atualizada para ${filters.media.toLowerCase()} na praça ${filters.city}.`);
  }

  function handleBuildPlan() {
    setPlanReady(true);
    setNotice('Plano demonstrativo criado com base no público selecionado.');
  }

  async function copyExecutiveSummary() {
    const summary = [
      'Resumo executivo · Ummix Ads',
      `Público: ${baseAudience.title}`,
      `Perfil & Hábitos: ${profileSummary}`,
      `Praça: ${filters.city} · ${filters.shift}`,
      `Cenário: ${selectedScenarioInfo.label}`,
      `Alcance estimado: ${formatNumber(scenarioReach)} pessoas`,
      `Investimento simulado: ${formatCurrency(scenarioInvestment)}`,
      `Melhor janela: ${String(bestHour).padStart(2, '0')}h–${String(bestHour + 1).padStart(2, '0')}h`,
    ].join('\n');

    if (!navigator.clipboard) {
      setNotice('O resumo está pronto, mas o navegador não liberou a cópia automática.');
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setSummaryCopied(true);
      setNotice('Resumo executivo copiado para a apresentação.');
    } catch {
      setNotice('Não foi possível copiar o resumo neste navegador.');
    }
  }

  return (
    <div className={styles.dashboardFrame}>
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <span className={styles.logo} aria-label="Ummix Ads">ummix ads</span>
        </div>

        <div className={styles.projectCard}>
          <span className={styles.projectEyebrow}>Desafio IndTechs</span>
          <strong>CRTI / Fieg</strong>
          <p>Conexão entre empresas e pessoas com deficiência.</p>
        </div>

        <nav className={styles.sidebarNav} aria-label="Navegação do painel">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                aria-pressed={active}
                onClick={() => navigateTo(item.id)}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
                {active ? <span className={styles.navIndicator} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <strong><span className={styles.footerDot} aria-hidden="true" /> Dados agregados</strong>
          <p>A Ummix Ads lê a audiência e transforma o insight em mensagem no ar.</p>
        </div>
      </aside>

      {mobileNavOpen ? (
        <button
          type="button"
          className={styles.mobileOverlay}
          aria-label="Fechar navegação"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <main className={styles.mainContent}>
        <div className={styles.mobileTopbar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Abrir navegação"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <span>Painel industrial</span>
          <button
            type="button"
            className={styles.mobileAvatar}
            aria-label="Abrir conta"
            onClick={() => setAccountOpen((open) => !open)}
          >
            {getInitials()}
          </button>
        </div>

        <header
          className={styles.pageHeader}
          ref={(element) => { sectionRefs.current.overview = element; }}
        >
          <div className={styles.breadcrumb}>
            Projetos <span>/</span> Inclusão produtiva <span>/</span> <strong>Indústria</strong>
          </div>
          <div className={styles.headerRow}>
            <div className={styles.headerCopy}>
              <div className={styles.headerKicker}>Ummix Ads · inteligência de audiência</div>
              <h1>Conexão que começa pela audiência.</h1>
              <p>Encontre onde e quando falar com as pessoas certas — e transforme o insight em uma mensagem que chega.</p>
            </div>
            <div className={styles.headerActions}>
              <button type="button" className={styles.demoPill} onClick={() => setNotice('Modo demonstração: todos os valores desta tela são mockados.')}>
                <span className={styles.demoDot} aria-hidden="true" /> Demonstração
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Ajuda"
                onClick={() => setNotice('A Central de Ajuda pode orientar a leitura desta etapa.')}
              >
                <CircleHelp size={16} aria-hidden="true" />
              </button>
              <div className={styles.accountMenu}>
                <button
                  type="button"
                  className={styles.avatarButton}
                  aria-expanded={accountOpen}
                  aria-label="Abrir menu da conta"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  {getInitials()}
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                {accountOpen ? (
                  <div className={styles.accountPopover} role="menu">
                    <strong>Demonstração</strong>
                    <span>Perfil de teste industrial</span>
                    <button type="button" role="menuitem" onClick={() => setAccountOpen(false)}>Fechar menu</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.isolationBanner} role="note">
          <span className={styles.isolationIcon}><ShieldCheck size={15} aria-hidden="true" /></span>
          <span className={styles.isolationCopy}>
            <strong>Mockup independente · edital</strong>
            <small>Experiência demonstrativa da Ummix Ads, com valores simulados e sem conexão com a plataforma.</small>
          </span>
          <span className={styles.isolationTag}>sem login · sem API</span>
        </div>

        <div className={styles.processRail} aria-label="Etapas da campanha">
          {PLATFORM_STEPS.map((step, index) => {
            const completed = activePlatformStep > step.n;
            const active = activePlatformStep === step.n;
            return (
              <div key={step.n} className={styles.processItem}>
                <button
                  type="button"
                  className={`${styles.processStep} ${active ? styles.processStepActive : ''} ${completed ? styles.processStepComplete : ''}`}
                  onClick={() => navigateTo(step.view)}
                  aria-pressed={active}
                >
                  <span className={styles.processNumber} aria-hidden="true">{completed ? <Check size={12} strokeWidth={3} /> : step.n}</span>
                  <span>{step.label}</span>
                </button>
                {index < PLATFORM_STEPS.length - 1 ? <span className={`${styles.processConnector} ${completed ? styles.processConnectorComplete : ''}`} aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>

        <section className={styles.heroGrid} aria-label="Perfil e potencial de conexão">
          <article className={`${styles.card} ${styles.audienceCard}`}>
            <div className={styles.cardTopline}>
              <span className={styles.eyebrow}>Perfil de audiência</span>
              <span className={styles.stepTag}>01 / 03</span>
            </div>
            <h2>Para quem vamos falar?</h2>
            <p className={styles.cardIntro}>Escolha um público para transformar a inteligência de mídia em uma ação de conexão.</p>

            <div className={styles.profileOptions}>
              {Object.values(AUDIENCE_PRESETS).map((profile) => {
                const Icon = profile.icon;
                const selected = selectedAudience === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    className={`${styles.profileOption} ${selected ? styles.profileOptionSelected : ''}`}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedAudience(profile.id);
                      setPlanReady(false);
                      setNotice(null);
                    }}
                  >
                    <span className={styles.profileIcon}><Icon size={16} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className={styles.profileText}>
                      <strong>{profile.title}</strong>
                      <small>{profile.subtitle}</small>
                    </span>
                    <span className={styles.selectionMark} aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className={styles.selectedProfile}>
              <span className={styles.selectedProfileIcon}><Check size={15} strokeWidth={2.3} aria-hidden="true" /></span>
              <span>
                <strong>{baseAudience.title}</strong>
                <small>Filtros ativos · {filters.city} · {filters.shift}</small>
              </span>
              <span className={styles.selectedProfileStatus}>Leitura agregada</span>
            </div>
          </article>

          <article className={`${styles.card} ${styles.potentialCard}`}>
            <div className={styles.potentialTopline}>
              <span className={styles.eyebrowLight}>Potencial de conexão</span>
              <button type="button" className={styles.updatedButton} onClick={() => setNotice('Dados demonstrativos atualizados agora.') }>
                <RefreshCw size={12} aria-hidden="true" /> Atualizado agora
              </button>
            </div>
            <h2>A audiência no caminho</h2>
            <div className={styles.metricsRow}>
              <div className={styles.metricBlock}>
                <span>Alcance estimado</span>
                <strong>{formatNumber(audience.reach)}</strong>
                <small>pessoas na praça</small>
              </div>
              <ArrowRight className={styles.metricArrow} size={16} aria-hidden="true" />
              <div className={styles.metricBlock}>
                <span>Afinidade do perfil</span>
                <strong>{formatNumber(audience.affinity)}</strong>
                <small>estimativa de afinidade</small>
              </div>
              <ArrowRight className={styles.metricArrow} size={16} aria-hidden="true" />
              <div className={styles.metricBlock}>
                <span>Resposta esperada</span>
                <strong>{formatPercent(audience.response)}</strong>
                <small>referência de campanha</small>
              </div>
            </div>
            <div className={styles.connectionProgress} aria-label={`Potencial de conexão de ${connectionProgress}%`}>
              <span style={{ width: `${connectionProgress}%` }} />
            </div>
            <p className={styles.potentialNote}><Lightbulb size={14} aria-hidden="true" /> A Ummix Ads entrega a leitura da audiência e a recomendação de mídia. A resposta acontece diretamente no rádio e na TV.</p>
          </article>
        </section>

        <section
          className={`${styles.card} ${styles.filtersCard}`}
          aria-labelledby="segmentation-title"
          ref={(element) => { sectionRefs.current.profile = element; }}
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Segmentação</span>
              <h2 id="segmentation-title">Construa seu público</h2>
            </div>
            <button type="button" className={styles.clearButton} onClick={clearFilters}>Limpar</button>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeading}>
              <div>
                <strong>Perfil &amp; Hábitos</strong>
                <p>Defina quem a campanha precisa alcançar.</p>
              </div>
              <span className={styles.filterCount}>3 filtros</span>
            </div>
            <div className={styles.profileFilterGrid}>
              <label className={styles.field} htmlFor="filter-disability">
                <span>Pessoas com deficiência</span>
                <select id="filter-disability" value={filters.disability} onChange={(event) => updateFilter('disability', event.currentTarget.value as Filters['disability'])}>
                  {DISABILITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-apprentice">
                <span>Jovem Aprendiz</span>
                <select id="filter-apprentice" value={filters.apprentice} onChange={(event) => updateFilter('apprentice', event.currentTarget.value as Filters['apprentice'])}>
                  {APPRENTICE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-age-range">
                <span>Faixa Etária</span>
                <select id="filter-age-range" value={filters.ageRange} onChange={(event) => updateFilter('ageRange', event.currentTarget.value as Filters['ageRange'])}>
                  {AGE_RANGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupHeading}>
              <div>
                <strong>Contexto de veiculação</strong>
                <p>Combine praça, momento e mídia para orientar a recomendação.</p>
              </div>
              <span className={styles.filterCount}>5 filtros</span>
            </div>
            <div className={styles.contextFilterGrid}>
              <label className={styles.field} htmlFor="filter-city">
                <span>Praça</span>
                <select id="filter-city" value={filters.city} onChange={(event) => updateFilter('city', event.currentTarget.value as Filters['city'])}>
                  {CITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-accessibility">
                <span>Necessidade de acessibilidade</span>
                <select id="filter-accessibility" value={filters.accessibility} onChange={(event) => updateFilter('accessibility', event.currentTarget.value as Filters['accessibility'])}>
                  {ACCESSIBILITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-professional-moment">
                <span>Momento profissional</span>
                <select id="filter-professional-moment" value={filters.professionalMoment} onChange={(event) => updateFilter('professionalMoment', event.currentTarget.value as Filters['professionalMoment'])}>
                  {MOMENT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-shift">
                <span>Turno predominante</span>
                <select id="filter-shift" value={filters.shift} onChange={(event) => updateFilter('shift', event.currentTarget.value as Filters['shift'])}>
                  {SHIFT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.field} htmlFor="filter-media">
                <span>Tipo de mídia</span>
                <select id="filter-media" value={filters.media} onChange={(event) => updateFilter('media', event.currentTarget.value as Filters['media'])}>
                  {MEDIA_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
          </div>
          <p className={styles.infoNote}><Info size={14} aria-hidden="true" /> Os recortes de perfil são demonstrativos e devem ser usados em análises agregadas, com base suficiente e consentimento específico.</p>
        </section>

        <section className={styles.decisionSection} aria-labelledby="decision-title">
          <div className={styles.decisionHeader}>
            <div>
              <span className={styles.eyebrow}>Resumo executivo</span>
              <h2 id="decision-title">Uma leitura para decidir.</h2>
              <p>Compare caminhos de mídia e leve uma recomendação clara para a conversa com a indústria.</p>
            </div>
            <button type="button" className={styles.copyButton} onClick={copyExecutiveSummary}>
              {summaryCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {summaryCopied ? 'Resumo copiado' : 'Copiar resumo'}
            </button>
          </div>

          <div className={styles.decisionLayout}>
            <div className={styles.executiveMetrics} aria-label="Indicadores executivos">
              <div className={styles.executiveMetric}>
                <span>Investimento simulado</span>
                <strong>{formatCurrency(scenarioInvestment)}</strong>
                <small>referência de veiculação</small>
              </div>
              <div className={styles.executiveMetric}>
                <span>Frequência semanal</span>
                <strong>{selectedScenarioInfo.frequency.split(' / ')[0]}</strong>
                <small>no cenário selecionado</small>
              </div>
              <div className={styles.executiveMetric}>
                <span>Alcance do cenário</span>
                <strong>{formatNumber(scenarioReach)}</strong>
                <small>pessoas estimadas</small>
              </div>
              <div className={styles.executiveMetric}>
                <span>Índice de conexão</span>
                <strong>{selectedScenarioInfo.impactScore}/100</strong>
                <small>{selectedScenarioInfo.impactLabel}</small>
              </div>
            </div>

            <div className={styles.scenarioPanel}>
              <div className={styles.scenarioHeading}>
                <div>
                  <strong>Compare cenários</strong>
                  <span>Escolha a narrativa mais forte para a apresentação.</span>
                </div>
                <Target size={17} aria-hidden="true" />
              </div>
              <div className={styles.scenarioTabs} role="tablist" aria-label="Cenários de mídia">
                {Object.values(SCENARIOS).map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedScenario === scenario.id}
                    className={`${styles.scenarioTab} ${selectedScenario === scenario.id ? styles.scenarioTabActive : ''}`}
                    onClick={() => {
                      setSelectedScenario(scenario.id);
                      setPlanReady(false);
                      setSummaryCopied(false);
                    }}
                  >
                    <span>{scenario.id === 'mix' ? <>Mix<br />recomendado</> : scenario.label}</span>
                    {scenario.id === 'mix' ? <small>recomendado</small> : null}
                  </button>
                ))}
              </div>
              <div className={styles.scenarioDetails} id="scenario-details" role="tabpanel">
                <span>Proposta</span>
                <strong>{selectedScenarioInfo.summary}</strong>
                <small><MapPin size={12} aria-hidden="true" /> {filters.city} · {filters.shift}</small>
              </div>
            </div>
          </div>

          <div className={styles.reasonStrip}>
            <span className={styles.reasonIcon}><Lightbulb size={16} aria-hidden="true" /></span>
            <div>
              <strong>Por que esta recomendação?</strong>
              <p>{recommendationReason}</p>
            </div>
          </div>
        </section>

        <section className={styles.insightsGrid} aria-label="Insights de mídia">
          <article
            className={`${styles.card} ${styles.hourCard}`}
            ref={(element) => { sectionRefs.current.hour = element; }}
          >
            <div className={styles.cardTopline}>
              <div>
                <span className={styles.eyebrow}>Mídia de rádio e TV</span>
                <h2>Hora a hora</h2>
              </div>
              <span className={styles.legend}><span aria-hidden="true" /> Afinidade estimada</span>
            </div>
            <p className={styles.cardIntro}>Quando a audiência está mais disponível para ouvir a mensagem.</p>
            <div className={styles.chartArea} role="img" aria-label="Afinidade estimada por hora">
              <div className={styles.chartGuides} aria-hidden="true"><span /><span /><span /></div>
              <div className={styles.barChart}>
                {audience.hourly.map((value, index) => {
                  const hour = 6 + index;
                  const isSelected = selectedHour === hour;
                  return (
                    <button
                      key={hour}
                      type="button"
                      className={`${styles.hourBar} ${isSelected ? styles.hourBarSelected : ''}`}
                      style={{ height: `${Math.max(19, Math.round((value / maxHourly) * 100))}%` }}
                      aria-label={`${hour}h, afinidade ${value}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedHour(hour)}
                    />
                  );
                })}
              </div>
            </div>
            <div className={styles.chartLabels} aria-hidden="true">
              {audience.hourly.map((_, index) => <span key={index}>{String(6 + index).padStart(2, '0')}h</span>)}
            </div>
            <div className={styles.chartReadout}>
              <Clock3 size={14} aria-hidden="true" />
              <span>Melhor janela</span>
              <strong>{String(selectedHour).padStart(2, '0')}h–{String(selectedHour + 1).padStart(2, '0')}h</strong>
              <small>pico de afinidade</small>
            </div>
          </article>

          <article
            className={`${styles.card} ${styles.mediaCard}`}
            ref={(element) => { sectionRefs.current.media = element; }}
          >
            <div className={styles.cardTopline}>
              <div>
                <span className={styles.eyebrow}>Mix recomendado</span>
                <h2>Onde falar</h2>
              </div>
              <span className={styles.affinityLabel}>Afinidade</span>
            </div>
            <div className={styles.mediaList}>
              {audience.media.map((placement, index) => (
                <button
                  type="button"
                  className={styles.mediaRow}
                  key={placement.name}
                  onClick={() => setNotice(`${placement.name} selecionada para a recomendação demonstrativa.`)}
                >
                  <span className={`${styles.rank} ${index === 0 ? styles.rankTop : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.mediaName}><strong>{placement.name}</strong><small>{placement.channel}</small></span>
                  <span className={styles.mediaProgress}><span style={{ width: `${Math.min(100, placement.affinity * 2.4)}%` }} /></span>
                  <strong className={styles.mediaValue}>{placement.affinity}%</strong>
                </button>
              ))}
            </div>
            <button type="button" className={styles.recommendationButton} onClick={handleRecommendation}>
              <span><Sparkles size={14} aria-hidden="true" /> Gerar recomendação de campanha</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </article>
        </section>

        <section className={styles.planRow}>
          <article
            className={`${styles.card} ${styles.planCard}`}
            ref={(element) => { sectionRefs.current.handoff = element; }}
          >
            <div className={styles.cardTopline}>
              <span className={styles.eyebrowWarm}>Próximo passo</span>
              <span className={styles.stepTag}>02 / 03</span>
            </div>
            <h2>Transformar audiência em resposta.</h2>
            <p className={styles.cardIntro}>Crie um plano com a janela de maior afinidade e uma chamada clara para o anúncio de rádio e TV.</p>
            <div className={styles.messagePreview}>
              <span className={styles.messageIcon}><Radio size={17} aria-hidden="true" /></span>
              <span><strong>“{campaignMessage}”</strong><small>Janela sugerida: {String(bestHour).padStart(2, '0')}h–{String(bestHour + 1).padStart(2, '0')}h · canal do proponente.</small></span>
            </div>
            <button type="button" className={styles.planButton} onClick={handleBuildPlan}>
              <span>{planReady ? 'Plano demonstrativo criado' : 'Montar plano demonstrativo'}</span>
              {planReady ? <Check size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
            </button>
            {planReady ? <p className={styles.planSuccess} role="status"><Check size={14} aria-hidden="true" /> Público, janela e mix registrados na simulação.</p> : null}
          </article>
        </section>

        <section className={styles.transparencyCard}>
          <span className={styles.transparencyIcon}><ShieldCheck size={18} aria-hidden="true" /></span>
          <div>
            <strong>Transparência por desenho</strong>
            <p>Este painel trabalha com estimativas agregadas de audiência. Ele não identifica pessoas nem entrega listas individuais: informa onde e quando a mensagem tem mais chance de chegar.</p>
          </div>
          <dl>
              <div><dt>Fonte</dt><dd>Pesquisa de audiência Ummix Ads</dd></div>
            <div><dt>Modo</dt><dd>Dados demonstrativos</dd></div>
          </dl>
        </section>

        <div className={styles.noticeRegion} aria-live="polite">
          {notice ? <span><Info size={14} aria-hidden="true" /> {notice}<button type="button" onClick={() => setNotice(null)} aria-label="Fechar aviso"><X size={13} aria-hidden="true" /></button></span> : null}
        </div>

        <footer className={styles.pageFooter}>
          <strong>Ummix Ads</strong>
          <span>Preparado para o Desafio IndTechs · CRTI / Fieg</span>
          <span>Do insight à mensagem que chega.</span>
        </footer>
      </main>
    </div>
  );
}
