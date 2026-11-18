
function ControlPanel({
  onNextRound,
  onReset,
  onFinish,
  isLastRound,
}) {
  return (
    <section className="control-panel">
      <h3>PANEL DEL PRESENTADOR</h3>

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
          className="btn-finish"
          onClick={onFinish}
        >
          🏆 FINALIZAR
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
