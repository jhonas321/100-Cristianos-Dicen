
import { useState } from "react";

import Header from "../components/Header";
import ScoreBoard from "../components/ScoreBoard";
import GameBoard from "../components/GameBoard";
import ControlPanel from "../components/ControlPanel";

import { questions } from "../data/preguntas";
import "../styles/game.css";

// EQUIPOS INICIALES
const initialTeams = [
  { name: "Equipo Rojo", score: 0, strikes: 0 },
  { name: "Equipo Azul", score: 0, strikes: 0 },
];

// NORMALIZAR TEXTO PARA COMPARAR RESPUESTAS
function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function GamePage() {
  // ESTADOS DEL JUEGO
  const [round, setRound] = useState(0);
  const [teams, setTeams] = useState(initialTeams);
  const [activeTeam, setActiveTeam] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [showStrike, setShowStrike] = useState(false);
  const [message, setMessage] = useState("");

  const currentQuestion = questions[round];
  const isLastRound = round === questions.length - 1;

  // SELECCIONAR EQUIPO MANUALMENTE
  function selectTeam(index) {
    setActiveTeam(index);
  }

  // CAMBIAR EL NOMBRE DE UN EQUIPO
  function renameTeam(index, newName) {
    const name = newName.trim();

    if (!name) return;

    setTeams((previous) =>
      previous.map((team, i) =>
        i === index
          ? { ...team, name }
          : team
      )
    );
  }

  // REVELAR UNA RESPUESTA Y SUMAR PUNTOS
  function revealAnswer(index) {
    if (revealedAnswers.includes(index)) {
      return false;
    }

    const answer = currentQuestion.answers[index];

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

    return true;
  }

  // REGISTRAR STRIKE AUTOMÁTICO
  function addStrike() {
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

    setMessage("¡RESPUESTA INCORRECTA!");
    setShowStrike(true);
  }

  // COMPROBAR LA RESPUESTA ESCRITA
  function checkAnswer(input) {
    const userAnswer = normalizeText(input);

    if (!userAnswer || showStrike) return;

    const index = currentQuestion.answers.findIndex(
      (answer) => {
        const acceptedAnswers = [
          answer.text,
          ...(answer.aliases || []),
        ];

        return acceptedAnswers.some(
          (text) =>
            normalizeText(text) === userAnswer
        );
      }
    );

    // RESPUESTA INCORRECTA
    if (index === -1) {
      addStrike();
      return;
    }

    // RESPUESTA YA DESCUBIERTA
    if (revealedAnswers.includes(index)) {
      setMessage("Esa respuesta ya fue descubierta.");
      return;
    }

    // RESPUESTA CORRECTA
    revealAnswer(index);

    setMessage(
      `¡Correcto! ${currentQuestion.answers[index].text}`
    );
  }

  // PASAR A LA SIGUIENTE RONDA
  function nextRound() {
    if (isLastRound) return;

    setRound((previous) => previous + 1);

    setRevealedAnswers([]);
    setShowStrike(false);
    setMessage("");

    // REINICIAR STRIKES, CONSERVAR PUNTOS Y NOMBRES
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

    setTeams(
      initialTeams.map((team) => ({
        ...team,
      }))
    );

    setActiveTeam(0);
    setRevealedAnswers([]);
    setShowStrike(false);
    setMessage("");
  }

  return (
    <div className="game-page">
      {/* ENCABEZADO */}
      <Header round={round + 1} />

      {/* MARCADOR DE EQUIPOS */}
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
        onCheckAnswer={checkAnswer}
        onNextRound={nextRound}
        onReset={resetGame}
        isLastRound={isLastRound}
      />

      {/* MENSAJES DEL JUEGO */}
      {message && !showStrike && (
        <div className="game-message">
          {message}
        </div>
      )}

      {/* ANIMACIÓN DE STRIKE */}
      {showStrike && (
        <div
          className="strike-overlay"
          onClick={() => setShowStrike(false)}
        >
          <span className="strike-symbol">
            ✕
          </span>

          <h2>¡RESPUESTA INCORRECTA!</h2>

          <p>Haz clic para continuar</p>
        </div>
      )}
    </div>
  );
}

export default GamePage;
