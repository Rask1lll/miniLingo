import { useEffect, useState } from 'react';
import styles from './LetterGame.module.css';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const LetterGame = ({ wordObj, onAnswer }) => {
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [answered, setAnswered] = useState(false); // ← флаг

  useEffect(() => {
    if (wordObj) {
      setLetters(shuffleArray(wordObj.word.split('')));
      setSelected([]);
      setAnswered(false); // сбрасываем на новый вопрос
    }
  }, [wordObj]);

  const handleClick = (letter, index) => {
    if (selected.includes(index) || answered) return;
    setSelected([...selected, index]);
  };

  const userAnswer = selected.map(i => letters[i]).join('');
  const isFinished = userAnswer.length === wordObj.word.length;

  useEffect(() => {
    if (isFinished && !answered) {
      setAnswered(true); // предотвратить повтор
      setTimeout(() => {
        const correct = userAnswer === wordObj.word;
        onAnswer(correct);
      }, 1000);
    }
  }, [isFinished, answered, userAnswer, wordObj, onAnswer]);

  return (
    <div className={styles.container}>
      <div className={styles.translation}>
        Переведите слово: <strong>{wordObj.translation}</strong>
      </div>

      <div className={styles.answerBox}>
        {selected.map(i => (
          <span key={i} className={styles.letter}>
            {letters[i]}
          </span>
        ))}
      </div>

      <div className={styles.letterGrid}>
        {letters.map((l, i) => (
          <button
            key={i}
            onClick={() => handleClick(l, i)}
            disabled={selected.includes(i) || answered}
            className={styles.letterBtn}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LetterGame;
