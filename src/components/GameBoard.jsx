
import AnswerCard from "./AnswerCard";

function GameBoard({
  question,
  revealedAnswers,
  onReveal,
}) {
  return (
    <main className="game-board">
      <div className="question-box">
        <span>PREGUNTA DEL CONCURSO</span>

        <h2>{question.question}</h2>
      </div>

      <div className="answers-list">
        {question.answers.map((answer, index) => (
          <AnswerCard
            key={index}
            answer={answer}
            number={index + 1}
            revealed={revealedAnswers.includes(index)}
            onReveal={() => onReveal(index)}
          />
        ))}
      </div>
    </main>
  );
}

export default GameBoard;
