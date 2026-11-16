import { useEffect, useState } from "react";
import { FanGallery } from "@/components/myui/fan-gallery/fan-gallery";

const items = [
  { src: "/app/app-home-vela-440.webp", alt: "Tela inicial do app Avanti com sequência de dias e Mental Score" },
  { src: "/app/app-report-bem-estar-440.webp", alt: "Report do dia: humor, energia, sono e emoções" },
  { src: "/app/app-conquista-elite-440.webp", alt: "Conquista desbloqueada: Você é Elite" },
  { src: "/app/app-compartilhar-dia-440.webp", alt: "Compartilhe o seu treino do dia" },
  { src: "/app/app-atividades-semana-440.webp", alt: "Atividades da semana: técnico, físico, mental e sono" },
];

export default function HeroFan() {
  // No celular, três telas maiores leem melhor do que cinco pequenas.
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return (
    <FanGallery
      key={small ? "s" : "l"}
      className="hero-fan"
      items={small ? [items[0], items[1], items[4]] : items}
      entrance="rise"
      trigger="auto"
      cardWidth={232}
      aspectRatio={1262 / 2624}
      spacing={0.84}
      curve={0.07}
      tilt={9}
      lift={26}
      spread={0.16}
      radius={40}
      speed={0.9}
      stagger={0.08}
      bounce={0.3}
      ariaLabel="Telas do app Avanti"
    />
  );
}
