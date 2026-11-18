
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

  const currentQuestion = questions[round];
  const isLastRound = round === questions.length - 1;

  // SELECCIONAR EQUIPO MANUALMENTE
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

  // PASAR A LA SIGUIENTE RONDA
  function nextRound() {
    if (isLastRound) return;

    setRound((previous) => previous + 1);
    setRevealedAnswers([]);

    setTeams((previous) =>
      previous.map((team) => ({
        ...team,
        strikes: 0,
      }))
    );
  }

  // REINICIAR TODO EL CONCURSO
  function resetGame() {
    const confirmed = window.confirm(
      "¿Estás seguro de reiniciar todo el concurso?"
    );

    if (!confirmed) return;

    setRound(0);
    setTeams(initialTeams.map((team) => ({ ...team })));
    setActiveTeam(0);
    setRevealedAnswers([]);
    setIsFinished(false);
  }

  // FINALIZAR CONCURSO
  function finishGame() {
    const confirmed = window.confirm(
      "¿Finalizar el concurso y mostrar los resultados?"
    );

    if (!confirmed) return;

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
    setIsFinished(false);
  }

  // MOSTRAR RESULTADOS FINALES
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
      {/* ENCABEZADO */}
      <Header round={round + 1} />

      {/* MARCADORES Y SELECCIÓN DE EQUIPOS */}
      <ScoreBoard
        teams={teams}
        activeTeam={activeTeam}
        onSelectTeam={selectTeam}
        onRenameTeam={renameTeam}
      />

      {/* TABLERO DE RESPUESTAS */}
      <GameBoard
        question={currentQuestion}
        revealedAnswers={revealedAnswers}
        onReveal={revealAnswer}
      />

      {/* PANEL DEL PRESENTADOR */}
      <ControlPanel
        onNextRound={nextRound}
        onReset={resetGame}
        onFinish={finishGame}
        isLastRound={isLastRound}
      />
    </div>
  );
}

export default GamePage;
