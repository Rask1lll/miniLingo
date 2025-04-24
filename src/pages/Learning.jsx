import { useEffect, useState } from 'react';
import styles from './Learning.module.css';

const Learning = ({ onStartLearningLesson }) => {
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/learning')
      .then(res => res.json())
      .then(setLessons)
      .catch(err => console.error('Ошибка при загрузке обучающих уроков:', err));

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5000/api/user/profile/${userId}`)
        .then(res => res.json())
        .then(data => {
          setCompleted(data.completedLessons || []);
        });
    }
  }, []);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>📘 Обучающие уроки</h2>
      <div className={styles.timeline}>
        {lessons.map((lesson, index) => {
          const isCompleted = completed.includes(lesson._id);

          return (
            <div key={lesson._id} className={styles.timelineItem}>
              {index !== 0 && (
                <div
                  className={`${styles.line} ${isCompleted ? styles.lineCompleted : ''}`}
                />
              )}
              <div
                className={`${styles.card} ${isCompleted ? styles.completedCard : ''}`}
                onClick={() => onStartLearningLesson(lesson)}
              >
                <h3>{lesson.title}</h3>
                <p>Категория: {lesson.category}</p>
                <p>Уровень: {lesson.level}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Learning;
