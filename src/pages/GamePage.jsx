
import { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import ScoreBoard from "../components/ScoreBoard";
import GameBoard from "../components/GameBoard";
import ControlPanel from "../components/ControlPanel";
import WinnerScreen from "../components/WinnerScreen";

import { questions } from "../data/preguntas";
import "../styles/game.css";

const initialTeams = [
  { name: "Equipo Rojo", score: 0, strikes: 0 },
  { name: "Equipo Azul", score: 0, strikes: 0 },
];

function GamePage() {
  const [round, setRound] = useState(0);
  const [teams, setTeams] = useState(initialTeams);
  const [activeTeam, setActiveTeam] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [strikeAnimation, setStrikeAnimation] = useState(null);

  // AUDIOS DEL CONCURSO
  const strikeAudio = useRef(null);
  const correctAudio = useRef(null);

  // CARGAR AUDIOS UNA SOLA VEZ
  useEffect(() => {
    strikeAudio.current = new Audio("/sounds/strike.mp3");
    correctAudio.current = new Audio("/sounds/acierto1.mp3");

    strikeAudio.current.preload = "auto";
    correctAudio.current.preload = "auto";

    strikeAudio.current.load();
    correctAudio.current.load();

    return () => {
      [strikeAudio.current, correctAudio.current].forEach(
        (audio) => {
          if (audio) {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
          }
        }
      );

      strikeAudio.current = null;
      correctAudio.current = null;
    };
  }, []);

  // REPRODUCIR SONIDO SIN RETRASO
  function playSound(type) {
    const audio =
      type === "strike"
        ? strikeAudio.current
        : correctAudio.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;

    audio.play().catch((error) => {
      console.error("Error al reproducir audio:", error);
    });
  }

  const currentQuestion = questions[round];
  const isLastRound = round === questions.length - 1;

  // SELECCIONAR EQUIPO
  function selectTeam(index) {
    setActiveTeam(index);
  }

  // CAMBIAR NOMBRE DEL EQUIPO
  function renameTeam(index, newName) {
    const name = newName.trim();

    if (!name) return;

    setTeams((previous) =>
      previous.map((team, i) =>
        i === index ? { ...team, name } : team
      )
    );
  }

  // REVELAR RESPUESTA Y REPRODUCIR ACIERTO
  function revealAnswer(index) {
    if (revealedAnswers.includes(index)) return;

    const answer = currentQuestion.answers[index];

    // SONIDO INMEDIATO AL HACER CLIC
    playSound("correct");

    setRevealedAnswers((previous) => [
      ...previous,
      index,
    ]);

    setTeams((previous) =>
      previous.map((team, i) =>
        i === activeTeam
          ? {
              ...team,
              score: team.score + answer.points,
            }
          : team
      )
    );
  }

  // STRIKE: SONIDO Y 1, 2 O 3 X GIGANTES
  function addStrike() {
    const currentStrikes = teams[activeTeam].strikes;

    if (currentStrikes >= 3) return;

    const nextStrikes = currentStrikes + 1;

    // SONIDO INMEDIATO AL HACER CLIC
    playSound("strike");

    setTeams((previous) =>
      previous.map((team, i) =>
        i === activeTeam
          ? {
              ...team,
              strikes: Math.min(team.strikes + 1, 3),
            }
          : team
      )
    );

    setStrikeAnimation((previous) => ({
      id: (previous?.id ?? 0) + 1,
      count: nextStrikes,
    }));
  }

  // SIGUIENTE RONDA
  function nextRound() {
    if (isLastRound) return;

    setRound((previous) => previous + 1);
    setRevealedAnswers([]);
    setStrikeAnimation(null);

    setTeams((previous) =>
      previous.map((team) => ({
        ...team,
        strikes: 0,
      }))
    );
  }

  // REINICIAR CONCURSO
  function resetGame() {
    const confirmed = window.confirm(
      "¿Estás seguro de reiniciar todo el concurso?"
    );

    if (!confirmed) return;

    setRound(0);
    setTeams(initialTeams.map((team) => ({ ...team })));
    setActiveTeam(0);
    setRevealedAnswers([]);
    setStrikeAnimation(null);
    setIsFinished(false);
  }

  // FINALIZAR CONCURSO
  function finishGame() {
    const confirmed = window.confirm(
      "¿Finalizar el concurso y mostrar los resultados?"
    );

    if (!confirmed) return;

    setStrikeAnimation(null);
    setIsFinished(true);
  }

  // JUGAR NUEVAMENTE
  function playAgain() {
    setRound(0);

    setTeams((previous) =>
      previous.map((team) => ({
        ...team,
        score: 0,
        strikes: 0,
      }))
    );

    setActiveTeam(0);
    setRevealedAnswers([]);
    setStrikeAnimation(null);
    setIsFinished(false);
  }

  // PANTALLA DEL GANADOR
  if (isFinished) {
    return (
      <WinnerScreen
        teams={teams}
        onRestart={playAgain}
      />
    );
  }

  return (
    <div className="game-page">
      <Header round={round + 1} />

      <ScoreBoard
        teams={teams}
        activeTeam={activeTeam}
        onSelectTeam={selectTeam}
        onRenameTeam={renameTeam}
      />

      <GameBoard
        question={currentQuestion}
        revealedAnswers={revealedAnswers}
        onReveal={revealAnswer}
      />

      <ControlPanel
        onStrike={addStrike}
        onNextRound={nextRound}
        onReset={resetGame}
        onFinish={finishGame}
        isLastRound={isLastRound}
        isStrikeDisabled={
          teams[activeTeam].strikes >= 3
        }
      />

      {/* ANIMACIÓN DE 1, 2 O 3 X */}
      {strikeAnimation && (
        <div
          key={strikeAnimation.id}
          className={`strike-overlay strike-count-${strikeAnimation.count}`}
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget
            ) return;

            const animationId = strikeAnimation.id;

            setStrikeAnimation((previous) =>
              previous?.id === animationId
                ? null
                : previous
            );
          }}
        >
          {Array.from(
            { length: strikeAnimation.count },
            (_, index) => (
              <span
                key={index}
                className="strike-big-x"
              >
                ✕
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default GamePage;
