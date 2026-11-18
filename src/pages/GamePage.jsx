
import { useState } from "react";

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

  const currentQuestion = questions[round];
  const isLastRound = round === questions.length - 1;

  // SELECCIONAR EQUIPO
  function selectTeam(index) {
    setActiveTeam(index);
  }

  // CAMBIAR NOMBRE
  function renameTeam(index, newName) {
    const name = newName.trim();

    if (!name) return;

    setTeams((previous) =>
      previous.map((team, i) =>
        i === index ? { ...team, name } : team
      )
    );
  }

  // REVELAR RESPUESTA Y SUMAR PUNTOS
  function revealAnswer(index) {
    if (revealedAnswers.includes(index)) return;

    const answer = currentQuestion.answers[index];

    setRevealedAnswers((previous) => [...previous, index]);

    setTeams((previous) =>
      previous.map((team, i) =>
        i === activeTeam
          ? { ...team, score: team.score + answer.points }
          : team
      )
    );
  }

  // STRIKE: MOSTRAR 1, 2 O 3 X
  function addStrike() {
    const currentStrikes = teams[activeTeam].strikes;

    if (currentStrikes >= 3) return;

    const nextStrikes = currentStrikes + 1;

    setTeams((previous) =>
      previous.map((team, i) =>
        i === activeTeam
          ? { ...team, strikes: Math.min(team.strikes + 1, 3) }
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

  // FINALIZAR
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
        isStrikeDisabled={teams[activeTeam].strikes >= 3}
      />

      {strikeAnimation && (
        <div
          key={strikeAnimation.id}
          className={`strike-overlay strike-count-${strikeAnimation.count}`}
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;

            const animationId = strikeAnimation.id;

            setStrikeAnimation((previous) =>
              previous?.id === animationId ? null : previous
            );
          }}
        >
          {Array.from(
            { length: strikeAnimation.count },
            (_, index) => (
              <span key={index} className="strike-big-x">
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
