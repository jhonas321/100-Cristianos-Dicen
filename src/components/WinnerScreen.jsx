
function WinnerScreen({ teams, onRestart }) {
  const [team1, team2] = teams;

  const isTie = team1.score === team2.score;

  const winner = isTie
    ? null
    : team1.score > team2.score
    ? team1
    : team2;

  const confetti = Array.from({ length: 45 }, (_, i) => ({
    left: `${(i * 37 + 13) % 100}%`,
    delay: `${(i * 0.17) % 5}s`,
    duration: `${3 + (i % 4)}s`,
    color: [
      "#FFD700",
      "#FF4757",
      "#38BDF8",
      "#FFFFFF",
      "#A78BFA",
    ][i % 5],
  }));

  return (
    <div className="winner-screen">
      {/* CONFETI */}
      <div className="winner-confetti" aria-hidden="true">
        {confetti.map((piece, index) => (
          <span
            key={index}
            className="confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div>

      {/* LUCES */}
      <div className="winner-light winner-light-left" />
      <div className="winner-light winner-light-right" />

      <div className="winner-content">
        <div className="winner-top-label">
          100 CRISTIANOS DICEN
        </div>

        <h1>
          {isTie
            ? "TENEMOS UN EMPATE"
            : "TENEMOS UN GANADOR"}
        </h1>

        <p className="winner-subtitle">
          {isTie
            ? "FELICIDADES A AMBOS EQUIPOS"
            : "CAMPEONES DEL CONCURSO"}
        </p>

        <div className="winner-name">
          {isTie
            ? "EMPATE"
            : winner.name}
        </div>

        <div className="winner-divider">
          <span>RESULTADOS FINALES</span>
        </div>

        <div className="final-scores">
          {teams.map((team, index) => {
            const isWinner = !isTie && team === winner;

            return (
              <div
                key={index}
                className={`final-team ${
                  isWinner ? "final-team-winner" : ""
                }`}
              >
                <div className="final-team-label">
                  {index === 0
                    ? "EQUIPO ROJO"
                    : "EQUIPO AZUL"}
                </div>

                <span className="final-team-name">
                  {team.name}
                </span>

                <strong>{team.score}</strong>

                <small>PUNTOS</small>

                {(isWinner || isTie) && (
                  <span className="final-champion-badge">
                    {isTie ? "EMPATE" : "CAMPEÓN"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="winner-message">
          Gracias por participar en 100 Cristianos Dicen
        </p>

        <button
          type="button"
          className="btn-play-again"
          onClick={onRestart}
        >
          JUGAR NUEVAMENTE
        </button>
      </div>
    </div>
  );
}

export default WinnerScreen;
