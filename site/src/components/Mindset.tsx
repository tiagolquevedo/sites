import { WordChips } from "@/components/myui/word-chips/word-chips";

// Ícones 24×24 nas cores do app (azul técnico, laranja físico, roxo mental, amarelo sono).
const ic = {
  trofeu: (
    <svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#fcc408" /><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" fill="none" stroke="#e2ae00" strokeWidth="1.6" strokeLinecap="round" /><path d="M10 13h4l1 5H9z" fill="#e2ae00" /><rect x="7" y="18" width="10" height="3" rx="1.5" fill="#10182a" /></svg>
  ),
  pressao: (
    <svg viewBox="0 0 24 24"><path d="M3 16a9 9 0 0 1 18 0" fill="none" stroke="#e7e3d8" strokeWidth="3.2" strokeLinecap="round" /><path d="M3 16a9 9 0 0 1 12.5-8.3" fill="none" stroke="#fcc408" strokeWidth="3.2" strokeLinecap="round" /><path d="m12 16 4.5-6" stroke="#10182a" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="2" fill="#10182a" /></svg>
  ),
  foco: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#3d8bff" /><circle cx="12" cy="12" r="6.2" fill="#fff" /><circle cx="12" cy="12" r="3" fill="#3d8bff" /><path d="m12 12 7.5-7.5M17 4.5h2.5V7" stroke="#10182a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
  ),
  erro: (
    <svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" fill="none" stroke="#8b5cf6" strokeWidth="2.6" strokeLinecap="round" /><path d="M20 3.5v4.6h-4.6" fill="none" stroke="#8b5cf6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  sono: (
    <svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="#10182a" /><path d="M16 3.5h3.5L16 7.5h3.5" fill="none" stroke="#fcc408" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  treino: (
    <svg viewBox="0 0 24 24"><rect x="2" y="9" width="3" height="6" rx="1.2" fill="#10182a" /><rect x="19" y="9" width="3" height="6" rx="1.2" fill="#10182a" /><rect x="5" y="6.5" width="3.4" height="11" rx="1.4" fill="#fcc408" /><rect x="15.6" y="6.5" width="3.4" height="11" rx="1.4" fill="#fcc408" /><rect x="8" y="11" width="8" height="2" rx="1" fill="#10182a" /></svg>
  ),
  podio: (
    <svg viewBox="0 0 24 24"><rect x="8.5" y="8" width="7" height="13" rx="1.6" fill="#fcc408" /><rect x="2" y="12" width="6.5" height="9" rx="1.6" fill="#d9d4c7" /><rect x="15.5" y="14.5" width="6.5" height="6.5" rx="1.6" fill="#fcc408" /><path d="m12 2.5 1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 8.5l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="#10182a" /></svg>
  ),
  bandeira: (
    <svg viewBox="0 0 24 24"><path d="M5 21V3.5" stroke="#10182a" strokeWidth="2" strokeLinecap="round" /><path d="M5 4h13l-3 4 3 4H5z" fill="#3d8bff" /><path d="M8 4h3v4H8zm3 4h3v4h-3z" fill="#fff" opacity=".9" /></svg>
  ),
  mala: (
    <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" fill="#8b5cf6" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" fill="none" stroke="#10182a" strokeWidth="1.8" /><path d="M3 12h18" stroke="#fff" strokeWidth="1.4" opacity=".7" /></svg>
  ),
};

export default function Mindset() {
  return (
    <WordChips
      className="mindset"
      title="Avanti"
      interval={2200}
      after=""
      parts={[
        {
          before: "Treine sua mente para",
          slot: [
            { word: "competir com confiança", icon: ic.trofeu },
            { word: "lidar com a pressão", icon: ic.pressao },
            { word: "manter o foco", icon: ic.foco },
            { word: "virar a página do erro", icon: ic.erro },
            { word: "dormir bem antes do campeonato", icon: ic.sono },
          ],
        },
        {
          before: "nos",
          slot: [
            { word: "treinos", icon: ic.treino },
            { word: "campeonatos", icon: ic.podio },
            { word: "momentos decisivos", icon: ic.bandeira },
            { word: "dias longe de casa", icon: ic.mala },
          ],
        },
      ]}
    />
  );
}
