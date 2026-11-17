
import { useState } from "react";

function ControlPanel({
  onCheckAnswer,
  onNextRound,
  onReset,
  isLastRound,
}) {
  const [answer, setAnswer] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!answer.trim()) return;

    onCheckAnswer(answer);
    setAnswer("");
  }

  return (
    <section className="control-panel">
      <h3>PANEL DEL PRESENTADOR</h3>

      <form
        className="answer-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="answer-input">
          Respuesta del participante
        </label>

        <div className="answer-input-group">
          <input
            id="answer-input"
            type="text"
            placeholder="Escribe la respuesta..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoComplete="off"
          />

          <button type="submit" className="btn-check">
            COMPROBAR
          </button>
        </div>
      </form>

      <div className="control-buttons">
        <button
          type="button"
          className="btn-next"
          onClick={onNextRound}
          disabled={isLastRound}
        >
          SIGUIENTE RONDA ➜
        </button>

        <button
          type="button"
          className="btn-reset"
          onClick={onReset}
        >
          REINICIAR
        </button>
      </div>
    </section>
  );
}

export default ControlPanel;
