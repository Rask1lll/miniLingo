import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css';

const Home = ({ onStartLesson, user, onLogout }) => {
  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/lessons')
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredLessons = lessons.filter(lesson =>
    filter === 'all' ? true : lesson.level === filter
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Уроки</h2>

      <div className={styles.filterButtons}>
        {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={filter === level ? styles.activeFilter : ''}
          >
            {level === 'all' ? 'Все' :
             level === 'Beginner' ? 'Лёгкие' :
             level === 'Intermediate' ? 'Средние' : 'Сложные'}
          </button>
        ))}
      </div>

      <div className={styles.lessonGrid}>
        {filteredLessons.map((lesson) => {
          const isCompleted = user.completedLessons?.includes(lesson._id);

          return (
            <div
              key={lesson._id}
              onClick={() => !isCompleted && onStartLesson(lesson)}
              className={styles.lessonCard}
              style={{
                opacity: isCompleted ? 0.5 : 1,
                pointerEvents: isCompleted ? 'none' : 'auto',
                position: 'relative',
              }}
            >
              <div><strong>{lesson.title}</strong></div>
              <div>Уровень: {lesson.level}</div>
              {isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#4caf50',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  ✔ Пройдено
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Home;
