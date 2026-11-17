
function AnswerCard({
    answer,
    number,
    revealed,
    onReveal,
  }) {
    return (
      <button
        type="button"
        className={`answer-card ${revealed ? "revealed" : ""}`}
        onClick={onReveal}
        disabled={revealed}
      >
        <span className="answer-number">
          {number}
        </span>
  
        <span className="answer-text">
          {revealed ? answer.text : "● ● ● ● ●"}
        </span>
  
        <span className="answer-points">
          {revealed ? answer.points : "?"}
        </span>
      </button>
    );
  }
  
  export default AnswerCard;
  