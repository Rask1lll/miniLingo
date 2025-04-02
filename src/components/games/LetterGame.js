import { useEffect, useState } from 'react';
import styles from './LetterGame.module.css';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const LetterGame = ({ wordObj, onAnswer }) => {
  const [letters, setLetters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (wordObj) {
      setLetters(shuffleArray(wordObj.word.split('')));
      setSelected([]);
      setAnswered(false);
    }
  }, [wordObj]);

  const handleClick = (letter, index) => {
    if (selected.includes(index) || answered) return;
    setSelected([...selected, index]);
  };

  const handleRemove = (indexToRemove) => {
    if (answered) return;
    setSelected((prev) => prev.filter((i) => i !== indexToRemove));
  };

  const handleHint = () => {
    if (answered || selected.length >= wordObj.word.length) return;

    const correctWord = wordObj.word.split('');
    for (let i = 0; i < correctWord.length; i++) {
      const correctLetter = correctWord[i];

      for (let j = 0; j < letters.length; j++) {
        if (
          letters[j] === correctLetter &&
          !selected.includes(j) &&
          selected.map((k) => letters[k])[i] !== correctLetter
        ) {
          setSelected((prev) => [...prev, j]);
          return;
        }
      }
    }
  };

  const userAnswer = selected.map(i => letters[i]).join('');
  const isFinished = userAnswer.length === wordObj.word.length;

  useEffect(() => {
    if (isFinished && !answered) {
      setAnswered(true);
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
        {selected.map((i, index) => (
          <span
            key={index}
            className={styles.letter}
            onClick={() => handleRemove(i)}
            title="Нажмите, чтобы убрать"
          >
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

      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <button onClick={handleHint} className={styles.hintBtn}>
          Подсказка
        </button>
      </div>
    </div>
  );
};

export default LetterGame;
