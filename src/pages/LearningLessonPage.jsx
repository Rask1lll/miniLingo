import { useEffect, useState } from 'react';
import styles from './LearningLessonPage.module.css';

const LearningLessonPage = ({ lesson, setView, setCurrentLearningLesson }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState([]);
  const [xpAwarded, setXpAwarded] = useState(false);

  const finished = lesson?.steps && stepIndex >= lesson.steps.length;
  const correct = result.filter(Boolean).length;

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (finished && !xpAwarded && userId && correct > 0) {
      fetch(`http://localhost:5000/api/user/xp/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: correct, streak: 0, lessonId: lesson._id })
      })
        .then(res => res.json())
        .then(() => setXpAwarded(true))
        .catch(err => console.error('Ошибка при обновлении XP:', err));
    }
  }, [finished, xpAwarded, correct, lesson._id]);

  if (!lesson || !lesson.steps || lesson.steps.length === 0) {
    return <div>Нет шагов в уроке</div>;
  }

  const current = lesson.steps[stepIndex];

  const handleAnswer = (opt) => {
    setSelected(opt);
    const isCorrect = opt === current.correctAnswer;
    setResult(prev => [...prev, isCorrect]);
    setTimeout(() => {
      setSelected(null);
      setStepIndex(prev => prev + 1);
    }, 1000);
  };

  const progress = ((stepIndex / lesson.steps.length) * 100).toFixed(0);

  if (finished) {
    return (
      <div className={styles.container}>
        <h2>🎉 Урок завершён</h2>
        <p>Вы правильно ответили на {correct} из {result.length} вопросов</p>
        <p>Получено XP: <strong>{correct}</strong></p>
        <button
          className={styles.okButton}
          onClick={() => {
            setCurrentLearningLesson(null); // Сброс урока
            setView('home'); // Переход на главную
          }}
        >
          ОК
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>

      {current.type === 'theory' && (
        <div className={styles.theory}>
          <p>{current.content}</p>
          <button className={styles.nextbtn} onClick={() => setStepIndex(stepIndex + 1)}>Далее</button>
        </div>
      )}

      {current.type === 'question' && (
        <div className={styles.questionBlock}>
          <h3>{current.question}</h3>
          <div className={styles.options}>
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className={
                  selected
                    ? opt === current.correctAnswer
                      ? styles.correct
                      : opt === selected
                      ? styles.incorrect
                      : ''
                    : ''
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningLessonPage;
