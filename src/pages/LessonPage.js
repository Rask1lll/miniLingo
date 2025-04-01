import { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import LetterGame from '../components/games/LetterGame';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const ChoiceGame = ({ wordObj, options, selected, onSelect }) => {
  return (
    <div className={styles.answersGrid}>
      {options.map((option, i) => (
        <div
          key={i}
          onClick={() => onSelect(option)}
          className={`${styles.answerCard} ${
            selected
              ? option === wordObj.translation
                ? styles.correct
                : option === selected
                ? styles.incorrect
                : ''
              : ''
          }`}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

const LessonPage = ({ lesson, user, updateUser }) => {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentWord = lesson.words[index];

  // prepare options for choice-type
  useEffect(() => {
    if (!currentWord || currentWord.type !== 'choice') return;

    const otherTranslations = shuffleArray(
      lesson.words.filter((w) => w._id !== currentWord._id)
    )
      .slice(0, 3)
      .map(w => w.translation);

    const choices = shuffleArray([
      currentWord.translation,
      ...otherTranslations
    ]);

    setOptions(choices);
    setSelected(null);
  }, [index, currentWord, lesson.words]);

  const handleChoiceSelect = (option) => {
    if (selected) return;
    setSelected(option);

    const isCorrect = option === currentWord.translation;
    if (isCorrect) {
      setXp(xp + 1);
      setFlash('correct');
    } else {
      setFlash('incorrect');
    }

    setTimeout(() => {
      setFlash('');
      setIndex((prev) => prev + 1);
    }, 1200);
  };

  const handleLetterAnswer = (isCorrect) => {
    if (isCorrect) {
      setXp(xp + 1);
      setFlash('correct');
    } else {
      setFlash('incorrect');
    }

    setTimeout(() => {
      setFlash('');
      setIndex((prev) => prev + 1);
    }, 1200);
  };

  useEffect(() => {
    if (!currentWord && !submitted && user) {
      setSubmitted(true);
      setFinished(true);

      fetch(`http://localhost:5000/api/user/xp/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xp,
          streak: 1,
          lessonId: lesson._id
        })
      })
        .then(res => res.json())
        .then(data => {
          updateUser({
            ...user,
            xp: data.xp,
            streak: data.streak,
            completedLessons: data.completedLessons,
          });
        })
        .catch(console.error);
    }
  }, [currentWord, submitted, xp, user, lesson._id, updateUser]);

  if (finished) {
    return (
      <div className={styles.resultScreen}>
        <h2>Урок завершён!</h2>
        <p>Вы заработали <strong>{xp} XP</strong></p>
        <button
          className={styles.okButton}
          onClick={() => window.location.reload()}
        >
          ОК
        </button>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className={styles.lessonContainer}>
      <div className={styles.progressBarOuter}>
        <div
          className={styles.progressBarInner}
          style={{ width: `${(index / lesson.words.length) * 100}%` }}
        ></div>
      </div>

      {flash && <div className={`${styles.flash} ${styles[flash]}`} />}

      <div className={styles.question}>
        {currentWord.type === 'choice' && (
          <>Переведите слово: <span style={{ color: '#0074D9' }}>{currentWord.word}</span></>
        )}

        {currentWord.type === 'letter' && (
          <>Составьте слово из букв по переводу: <span style={{ color: '#0074D9' }}>{currentWord.translation}</span></>
        )}
      </div>

      {currentWord.type === 'choice' && (
        <ChoiceGame
          wordObj={currentWord}
          options={options}
          selected={selected}
          onSelect={handleChoiceSelect}
        />
      )}

      {currentWord.type === 'letter' && (
        <LetterGame
          wordObj={currentWord}
          onAnswer={handleLetterAnswer}
        />
      )}
    </div>
  );
};

export default LessonPage;
