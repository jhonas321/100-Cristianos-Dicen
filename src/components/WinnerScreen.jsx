
function WinnerScreen({ teams, onRestart }) {
    const sortedTeams = [...teams].sort(
      (a, b) => b.score - a.score
    );
  
    const isTie = sortedTeams[0].score === sortedTeams[1].score;
  
    const winner = sortedTeams[0];
  
    return (
      <main className="winner-screen">
        <div className="winner-content">
          <div className="winner-trophy">🏆</div>
  
          <h1>100 CRISTIANOS DICEN</h1>
          <h2>¡CONCURSO FINALIZADO!</h2>
  
          {isTie ? (
            <h3 className="winner-name">
              ¡EMPATE!
            </h3>
          ) : (
            <>
              <p>EL EQUIPO GANADOR ES</p>
  
              <h3 className="winner-name">
                {winner.name}
              </h3>
            </>
          )}
  
          <div className="final-scores">
            {sortedTeams.map((team, index) => (
              <div
                className="final-team"
                key={index}
              >
                <span>{team.name}</span>
  
                <strong>{team.score}</strong>
  
                <small>PUNTOS</small>
              </div>
            ))}
          </div>
  
          <button
            type="button"
            className="btn-play-again"
            onClick={onRestart}
          >
            ↻ JUGAR NUEVAMENTE
          </button>
        </div>
      </main>
    );
  }
  
  export default WinnerScreen;
  