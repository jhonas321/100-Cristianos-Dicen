
import { useState } from "react";

function ScoreBoard({
  teams,
  activeTeam,
  onSelectTeam,
  onRenameTeam,
}) {
  const [editingTeam, setEditingTeam] = useState(null);
  const [newName, setNewName] = useState("");

  function startEditing(index, name) {
    setEditingTeam(index);
    setNewName(name);
  }

  function saveName(index) {
    const name = newName.trim();

    if (name) {
      onRenameTeam(index, name);
    }

    setEditingTeam(null);
  }

  return (
    <section className="scoreboard">
      {teams.map((team, index) => (
        <div
          key={index}
          className={`team-card team-${index} ${
            activeTeam === index ? "active" : ""
          }`}
          onClick={() => {
            if (editingTeam === null) {
              onSelectTeam(index);
            }
          }}
        >
          <div className="team-name-container">
            {editingTeam === index ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveName(index);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  className="team-name-input"
                  type="text"
                  value={newName}
                  maxLength={25}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />

                <button
                  type="submit"
                  className="save-name-btn"
                >
                  ✓
                </button>

                <button
                  type="button"
                  className="cancel-name-btn"
                  onClick={() => setEditingTeam(null)}
                >
                  ✕
                </button>
              </form>
            ) : (
              <>
                <h2>{team.name}</h2>

                <button
                  type="button"
                  className="edit-team-btn"
                  title="Editar nombre del equipo"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(index, team.name);
                  }}
                >
                  ✎
                </button>
              </>
            )}
          </div>

          <div className="team-points">
            {team.score}
          </div>

          <div className="team-strikes">
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className={
                  i < team.strikes ? "strike-active" : ""
                }
              >
                ✕
              </span>
            ))}
          </div>

          <div className="team-status">
            {activeTeam === index
              ? "● EQUIPO JUGANDO"
              : "CLIC PARA SELECCIONAR"}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ScoreBoard;
