export const LINKS = {
  // A página de depoimentos ainda não lê o filtro pela URL (ver TestimonialsShowcase no app).
  testimonialsApp: "https://app.avantiperformance.com.br/depoimentos?servico=aplicativo",
  appStore: "https://apps.apple.com/br/app/avanti-feito-para-atletas/id6758354583",
  googlePlay: "https://play.google.com/store/apps/details?id=com.despia.avanti",
  whatsapp: "https://wa.me/5551997929080",
  whatsappMsg: (msg: string) => `https://wa.me/5551997929080?text=${encodeURIComponent(msg)}`,
  /** Assinatura pelo site (sem a taxa das lojas). A página /app#planos mostra os dois planos. */
  plans: "/app#planos",
  /** Grupo gratuito da comunidade de psicólogos e estudantes. */
  comunidade: "https://chat.whatsapp.com/LAUQqtmH8Kh9Hhi0q8NiPM",
  /** Formulário do Tally (lista de supervisão e cursos de extensão). */
  tallyForm: "0QjevQ",
  checkoutMonthly: "https://pay.cakto.com.br/sq6b9gx",
  checkoutYearly: "https://pay.cakto.com.br/zh5j4an",
};

export const SOLUTIONS = [
  { title: "App Avanti", desc: "Treino mental no dia a dia, com dados e IA.", href: "/#app", icon: "app" },
  { title: "Assessoria individual", desc: "Acompanhamento com psicólogo, 100% online.", href: "/#assessoria", icon: "assessoria" },
  { title: "Educação", desc: "Capacitação, supervisão e comunidade para profissionais.", href: "/educacao", icon: "educacao" },
  { title: "Organizações", desc: "Programas para clubes, federações e equipes.", href: "/#organizacoes", icon: "organizacoes" },
] as const;

export const PRICE = { month: "R$ 30", year: "R$ 249", yearPerMonth: "R$ 20,75" };

/** Atletas parceiros: aparecem em destaque, com foto. */
export const testimonials = [
  {
    name: "Felipe Loch",
    role: "Beach tênis · 4º do mundo",
    photo: "/img/felipe-loch.webp",
    portrait: "/img/felipe-loch-retrato.webp",
    quote:
      "O app da Avanti me ajuda a organizar pensamentos e emoções que normalmente eram esquecidos na rotina e a transformar isso em dados que agora eu vejo com clareza.",
  },
  {
    name: "Matheus Melecchi",
    role: "Natação · 12º do mundo",
    photo: "/img/matheus-melecchi.webp",
    portrait: "/img/matheus-melecchi-retrato.webp",
    quote:
      "O app mostrou que eu não estava descansando o suficiente. Com o relatório mensal da Avanti identifiquei isso e estou muito melhor.",
  },
  {
    name: "Jorge Fanck",
    role: "Tênis de mesa · Treinador em Paris 2024",
    photo: "/img/jorge-fanck.webp",
    portrait: "/img/jorge-fanck-retrato.webp",
    quote:
      "Me ajuda muito na abordagem com os meus atletas. Consigo ver se estão bem e o que têm treinado, além de acompanhar metas e a avaliação das competições.",
  },
  {
    name: "Lucas Rabelo",
    role: "Skate · Campeão Pan-Americano",
    photo: "/img/lucas-rabelo.webp",
    portrait: "/img/lucas-rabelo-retrato.webp",
    quote:
      "O trabalho com a Avanti tem me ajudado demais, dentro e fora do esporte. Acredito que qualquer atleta deveria ter um apoio como o que eles me dão.",
  },
];

/** Depoimentos de clientes (app.avantiperformance.com.br/depoimentos). Trechos longos foram encurtados com "…". */
export const community = [
  { name: "Sofia", who: "Atleta", sport: "Tênis de mesa", tag: "App", quote: "O aplicativo me ajudou a perceber melhor como estava o meu desempenho no dia a dia, a ficar atenta a momentos de estresse ou tensão e assim fazer algo para melhorar isso." },
  { name: "Antônio", who: "Atleta", sport: "Vela", tag: "App", quote: "Com o app consigo mapear tudo o que já treinei no mês, o que ainda tenho pela frente e, principalmente, a qualidade de cada treino. Esse controle mudou o meu jogo." },
  { name: "Luís Augusto", who: "Pai", sport: "Tênis", tag: "Assessoria", quote: "A Avanti prestou um grande auxílio ao meu filho nas questões emocionais e pré-competição. Agradeço por esse apoio na formação dele." },
  { name: "Maria", who: "Atleta", sport: "Tênis de mesa", tag: "App", quote: "O aplicativo me ajudou muito! Ele ajuda a incluir o trabalho mental no dia a dia, não só na hora da competição! Faz você olhar pro dia a dia de uma forma diferente!" },
  { name: "Antonella", who: "Atleta", sport: "Vela", tag: "Mentoria em grupo", quote: "Com a Avanti, aprendi que a mente anda lado a lado com o sucesso. O programa me ajudou muito a lidar com situações como pressão, ansiedade e cobrança, dentro e fora d’água." },
  { name: "Thomas", who: "Atleta", sport: "Vela", tag: "App", quote: "A usabilidade do aplicativo e a disposição das informações viabilizam esse controle em níveis jamais vistos. Tudo isso para dar ao atleta a vantagem psicológica que faz a diferença." },
  { name: "Taiana", who: "Mãe", sport: "Vela", tag: "Assessoria", quote: "Percebo, no dia a dia, o quanto a Duda tem evoluído: mais confiante, mais aberta para expressar sentimentos e mais preparada para lidar com desafios." },
  { name: "Bernardo", who: "Atleta", sport: "Vela", tag: "App", quote: "Muita gente foca só no barco e esquece que quem segura o leme é a nossa cabeça. Aprendi a respirar e a ter paciência comigo mesmo." },
  { name: "Duda", who: "Atleta", sport: "Vela", tag: "App", quote: "Com as informações que eu coloco todos os dias, o app vai transformando em dados que me ajudam muito com o meu desempenho e mostra onde eu devo focar mais." },
  { name: "Mariana", who: "Mãe", sport: "Automobilismo", tag: "Assessoria", quote: "Desde o início ele teve um excelente atendimento e evoluiu muito como atleta. Recomendo demais o trabalho deles." },
  { name: "Bernardo", who: "Atleta", sport: "Tênis de mesa", tag: "App", quote: "Com esse aplicativo eu consigo ter mais autoconhecimento e deixar claros os meus objetivos para os campeonatos. É bem rápido de usar diariamente." },
];

export const faq = [
  {
    q: "O que é a Avanti?",
    a: "A Avanti é um ecossistema completo de psicologia do esporte que tem como objetivo oferecer soluções de qualidade para atletas e profissionais da psicologia.",
  },
  {
    q: "A Avanti também é terapia?",
    a: "Sim. Na assessoria individual, você é acompanhado por psicólogos em um trabalho individual e personalizado, que cuida tanto da performance quanto de quem você é fora do esporte.",
  },
  {
    q: "Como funciona o acompanhamento individual?",
    a: "Online, com encontros regulares com um psicólogo da Avanti. O plano é feito para você, para o seu esporte e para o seu momento, e o acompanhamento é integrado ao app. O primeiro passo é uma conversa no WhatsApp.",
  },
  {
    q: "Serve para o meu esporte e para o meu nível?",
    a: "Sim. Atendemos atletas de qualquer modalidade, do amador ao profissional. Cada trabalho é personalizado ao seu esporte, à sua rotina e aos seus objetivos.",
  },
  {
    q: "Posso usar o app junto com o meu psicólogo?",
    a: "Sim. O app funciona sozinho, mas fica ainda melhor com um profissional: o seu psicólogo acompanha seus dados no dia a dia e chega em cada sessão sabendo como você está.",
  },
  {
    q: "Sou psicóloga(o) ou estudante. Como a Avanti me ajuda?",
    a: "Pela Avanti Educação: capacitações em psicologia do esporte, supervisão individual e em grupo e uma comunidade de profissionais. No app, você acompanha seus atletas com dados.",
  },
  {
    q: "Clubes e federações podem usar?",
    a: "Sim. Montamos programas sob medida para a equipe, com acompanhamento dos atletas por profissionais da Avanti, acesso ao app e relatórios para a comissão técnica.",
  },
  {
    q: "Meus dados ficam protegidos?",
    a: "Sim. Seguimos a LGPD e seus dados só aparecem para um profissional ou equipe quando você faz o vínculo no app. Os detalhes estão na Política de Privacidade.",
  },
];

/** Perguntas da página /app. */
export const appFaq = [
  {
    q: "Para qual tipo de atleta é o app?",
    a: "Para qualquer atleta, do amador ao profissional, em qualquer esporte. Se você treina ou compete com metas, o app foi feito para você.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Você tem 7 dias para testar o app sem compromisso. Se não gostar, é só cancelar e não cobramos nada.",
  },
  {
    q: "Por que a assinatura é feita pelo site?",
    a: "Assinando por aqui, sem passar pelas lojas, conseguimos manter o preço mais baixo. Depois é só baixar o app no iPhone ou no Android e entrar com a sua conta.",
  },
  {
    q: "Como funciona o plano anual?",
    a: "É um pagamento único de R$ 249 com acesso por 12 meses, o que equivale a R$ 20,75 por mês. Sai mais em conta do que o plano mensal.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. No plano mensal você cancela a qualquer momento, sem multa. No plano anual, o acesso vale até o fim do período pago.",
  },
  {
    q: "O app substitui um psicólogo?",
    a: "Não. O app é uma ferramenta de autoconhecimento, monitoramento e preparação. Para um trabalho individual, a Avanti tem a assessoria com psicólogos, e você pode vincular o seu profissional ao app.",
  },
  {
    q: "O app funciona para o meu esporte?",
    a: "Sim. Os conteúdos e as trilhas se adaptam ao seu esporte, com materiais para endurance, tênis, beach tênis, vela, natação, lutas e muito mais.",
  },
];

/** O que está incluso na assinatura do app (os dois planos). */
export const APP_INCLUDED = [
  "Acesso completo ao app e aos cursos do método Avanti",
  "Report diário, Mental Score e algoritmo de alertas",
  "Avaliações psicológicas e de perfil de atleta",
  "Relatórios mensais personalizados",
  "Campeonatos e metas",
  "Airton, assistente com IA",
  "Comunidade Avanti",
  "Desconto na assessoria individual",
  "Integração com wearables (em breve)",
];

export const eduFaq = [
  {
    q: "Estudante pode participar?",
    a: "Pode. A comunidade é para psicólogos e estudantes de Psicologia. No formulário, é só marcar que você é estudante.",
  },
  {
    q: "Como vai funcionar a supervisão?",
    a: "Em grupo, são 6 a 8 participantes com encontros quinzenais, por R$ 300 por mês; as primeiras turmas abrem em breve, primeiro para quem está na comunidade. A supervisão individual é combinada direto com a gente pelo WhatsApp.",
  },
  {
    q: "Quando abrem as turmas?",
    a: "Em breve. Quem está na lista e na comunidade fica sabendo antes de todo mundo, com as datas e os detalhes de cada turma.",
  },
  {
    q: "Preciso já atuar no esporte para entrar?",
    a: "Não. A comunidade é para quem já atua e para quem quer começar a trabalhar com atletas.",
  },
] as const;
