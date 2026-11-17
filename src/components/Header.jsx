
function Header({ round }) {
    return (
      <header className="game-header">
        <p className="game-subtitle">
          EL GRAN CONCURSO BÍBLICO
        </p>
  
        <h1>
          <span>100</span> CRISTIANOS DICEN
        </h1>
  
        <div className="round-badge">
          RONDA {round}
        </div>
      </header>
    );
  }
  
  export default Header;
  