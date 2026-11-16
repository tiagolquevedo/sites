import { LINKS } from "@/data/site";

/**
 * Tudo que muda no link da bio mora aqui: variante padrão, destinos e textos.
 * As quatro variantes leem este arquivo; para trocar um link ou a ordem, edite só aqui.
 *
 * Para testar outra variante sem mexer no padrão: /links?v=stories | conversa | cartas | basica
 */
export type Variant = "perfil" | "basica" | "stories" | "conversa" | "cartas";

export const DEFAULT_VARIANT: Variant = "perfil";
export const VARIANTS: Variant[] = ["perfil", "basica", "stories", "conversa", "cartas"];

/** Origem que vai nas URLs internas, para separar o tráfego da bio no resto do site. */
export const UTM = { source: "instagram", medium: "bio" };

export type DestId = "app" | "assessoria" | "educacao" | "organizacoes" | "fundador";

export interface Dest {
  id: DestId;
  /** Nome curto (cards, chips). */
  label: string;
  /** Uma linha explicando para quem é. */
  desc: string;
  href: string;
  /** Ícone de SolutionIcon; o fundador usa o ícone do WhatsApp no botão. */
  icon?: "app" | "assessoria" | "educacao" | "organizacoes";
  /** Texto do botão quando ele não é "Seja [logo]". */
  cta: string;
}

/** Na ordem em que aparecem. */
export const DESTS: Dest[] = [
  { id: "app", label: "App Avanti", desc: "Treino mental no dia a dia, com dados e IA.", href: "/app", icon: "app", cta: "Seja Avanti" },
  { id: "assessoria", label: "Assessoria individual", desc: "Acompanhamento com psicólogo, 100% online.", href: "/#assessoria", icon: "assessoria", cta: "Conhecer a assessoria" },
  { id: "educacao", label: "Educação", desc: "Comunidade, supervisão e cursos para psicólogos.", href: "/educacao", icon: "educacao", cta: "Entrar na comunidade" },
  { id: "organizacoes", label: "Organizações", desc: "Programas para clubes, federações e equipes.", href: "/#organizacoes", icon: "organizacoes", cta: "Ver programas" },
  { id: "fundador", label: "Fale com o fundador", desc: "Tire dúvidas direto no WhatsApp.", href: LINKS.whatsapp, cta: "Fale com o fundador" },
];

export const dest = (id: DestId) => DESTS.find((d) => d.id === id)!;

export const HEADLINE = "Preparação mental para quem compete.";
export const PROOF = "1.000+ atletas impactados";

/* ------------------------------------------------------------------ */
/* Variante "perfil": o conteúdo editável fica todo aqui.             */
/* ------------------------------------------------------------------ */

export const PERFIL = {
  name: "Avanti Psicologia",
  kicker: "App · Assessoria · Educação",
  bio: "Um ecossistema de soluções em preparação psicológica no esporte.",
  /** Fotos de fundo atrás da logo; trocam sozinhas, em ordem. */
  covers: [
    "/links/hero-vela.webp",
    "/links/capa-2.webp",
    "/links/capa-3.webp",
    "/links/capa-4.webp",
    "/links/capa-5.webp",
    "/links/capa-6.webp",
  ],
  /** Segundos que cada foto fica na tela. */
  coverSeconds: 5,
};

export const SOCIAL = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com/avantipsicologia_" },
  // TODO: trocar pelo canal da Avanti, se existir (hoje aponta para o canal onde o vídeo foi publicado).
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@tiagolquevedo" },
  { id: "whatsapp", label: "WhatsApp", href: LINKS.whatsapp },
  { id: "site", label: "Site", href: "/" },
] as const;

/** Primeira fileira horizontal. */
export const COMUNIDADE = {
  title: "Comunidade Avanti",
  cards: [
    { id: "site", label: "Avanti", desc: "Conheça tudo", href: "/", img: "/links/site-preview.webp", pos: "50% 0%" },
    { id: "app", label: "Aplicativo", desc: "Para atletas", href: "/app", mocks: ["/app/app-home-vela-440.webp", "/app/app-mental-score-440.webp", "/app/app-report-resumo-440.webp"] },
    { id: "assessoria", label: "Assessoria", desc: "Individual", href: "/#assessoria", img: "/links/assessoria.webp", pos: "50% 50%" },
    { id: "educacao", label: "Educação", desc: "Para psicólogos", href: "/educacao", img: "/img/fundadores.webp", pos: "50% 46%", zoom: 1.3 },
  ],
};

/** Destaque principal. Hoje com mockups do app; para virar vídeo, preencha `video` (a imagem vira a capa). */
export const DESTAQUE = {
  tag: "App Avanti",
  title: "Treine a mente todo dia.",
  desc: "Rotina, report e seus dados em um só lugar.",
  href: "/app",
  mocks: ["/app/app-home-vela-440.webp", "/app/app-mental-score-440.webp"],
  badge: "/links/membership.webp",
  stores: [
    { id: "appstore", label: "App Store", href: LINKS.appStore },
    { id: "googleplay", label: "Google Play", href: LINKS.googlePlay },
  ],
  video: "" as string, // ex.: "https://www.youtube.com/watch?v=..."
};

export const VIDA_DE_ATLETA = {
  title: "Vida de Atleta",
  sub: "Acompanhamos um atleta por um dia inteiro, nos bastidores.",
  overlay: "É isso todo dia",
  href: "https://www.youtube.com/watch?v=Ugz6mwduYP8&t=8s",
  img: "/links/vida-de-atleta.webp",
};

export const NEWSLETTER = {
  title: "Entre para a newsletter",
  desc: "Conteúdo de preparação mental no seu e-mail.",
  url: "" as string, // preencha quando tiver o link; vazio mostra "Em breve"
};
