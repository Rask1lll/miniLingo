import { useEffect, useState } from 'react';
import styles from './LessonPage.module.css';
import LetterGame from '../components/games/LetterGame';
import ImageGame from '../components/games/ImageGame';
import MatchingGame from '../components/games/MatchingGame';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const ChoiceGame = ({ wordObj, options, selected, onSelect, level }) => {
  const levelColor =
    level === 'Intermediate' ? '#fff3cd' :
    level === 'Advanced' ? '#f8d7da' :
    'white';

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
          style={{ backgroundColor: levelColor }}
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

  const isMatching = lesson?.type === 'matching';
  const currentWord = isMatching ? null : lesson?.words?.[index];

  useEffect(() => {
    if (!currentWord || isMatching) return;

    if (currentWord.type === 'choice') {
      const otherTranslations = shuffleArray(
        lesson.words.filter(w => w._id !== currentWord._id)
      ).slice(0, 3).map(w => w.translation);

      setOptions(shuffleArray([currentWord.translation, ...otherTranslations]));
      setSelected(null);
    }

    if (currentWord.type === 'image') {
      const otherWords = shuffleArray(
        lesson.words.filter(w => w._id !== currentWord._id)
      ).slice(0, 3).map(w => w.word);

      setOptions(shuffleArray([currentWord.word, ...otherWords]));
      setSelected(null);
    }
  }, [index, currentWord, lesson, isMatching]);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);

    const isCorrect = currentWord.type === 'image'
      ? option === currentWord.word
      : option === currentWord.translation;

    if (isCorrect) {
      setXp(xp + 1);
      setFlash('correct');
    } else {
      setFlash('incorrect');
    }

    setTimeout(() => {
      setFlash('');
      setIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= lesson.words.length) {
          setFinished(true);
        }
        return nextIndex;
      });
    }, 1000);
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
      setIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= lesson.words.length) {
          setFinished(true);
        }
        return nextIndex;
      });
    }, 1000);
  };

  const handleMatchingComplete = (correctCount) => {
    setXp(correctCount);
    setFlash('correct');
    setFinished(true);
    setTimeout(() => {
      setFlash('');
    }, 1000);
  };
  
  


  useEffect(() => {
    if (!submitted && finished && user) {
      console.log("📤 Завершение урока. XP отправляется");

      setSubmitted(true);

      fetch(`http://localhost:5000/api/user/xp/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp, streak: 1, lessonId: lesson._id })
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
  }, [submitted, finished, user, xp, lesson._id, updateUser]);

  if (!lesson || !lesson.words || lesson.words.length === 0) {
    return <div className={styles.lessonContainer}>Нет доступных слов для этого урока.</div>;
  }

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

  return (
    <div className={styles.lessonContainer}>
      {!isMatching && (
        <>
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarInner}
              style={{ width: `${(index / lesson.words.length) * 100}%` }}
            ></div>
          </div>

          {flash && <div className={`${styles.flash} ${styles[flash]}`} />}
        </>
      )}

      <div className={styles.question}>
        {lesson.type === 'matching' && <>Сопоставьте слова и переводы:</>}
        {currentWord?.type === 'choice' && <>Переведите слово: <span style={{ color: '#0074D9' }}>{currentWord.word}</span></>}
        {currentWord?.type === 'letter' && <>Составьте слово из букв по переводу: <span style={{ color: '#0074D9' }}>{currentWord.translation}</span></>}
        {currentWord?.type === 'image' && <>Выберите правильное слово по картинке:</>}
      </div>

      {currentWord?.type === 'choice' && (
        <ChoiceGame
          wordObj={currentWord}
          options={options}
          selected={selected}
          onSelect={handleSelect}
          level={lesson.level} // Передаём уровень
        />
      )}


      {currentWord?.type === 'letter' && (
        <LetterGame
          wordObj={currentWord}
          onAnswer={handleLetterAnswer}
          level={lesson.level}
        />
      )}

      {currentWord?.type === 'image' && (
        <ImageGame
          wordObj={{ ...currentWord, options }}
          onSelect={handleSelect}
          selected={selected}
          level={lesson.level} // Передаём уровень
        />
      )}


      {lesson.type === 'matching' && (
        <MatchingGame
          wordPairs={lesson.words}
          onComplete={handleMatchingComplete}
          level={lesson.level} // Передаём уровень
        />
      )}

    </div>
  );
};

export default LessonPage;
