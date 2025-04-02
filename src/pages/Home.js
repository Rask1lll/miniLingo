import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css';

const Home = ({ onStartLesson, user, onLogout }) => {
  const [lessons, setLessons] = useState([]);
  const [imageGames, setImageGames] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/lessons')
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/lessons/image')
      .then(res => setImageGames(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredLessons = lessons
    .filter(lesson => lesson.type === 'game')
    .filter(lesson => filter === 'all' ? true : lesson.level === filter);

  const isCompleted = (lessonId) => user.completedLessons?.includes(lessonId);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>МИНИ-ИГРЫ</h2>
      <p className={styles.subtitle}>
        Эти игры помогут запомнить слова в лёгкой и интерактивной форме.
      </p>

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

      {filteredLessons.length > 6 ? (
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {filteredLessons.map(lesson => (
              <div
                key={lesson._id}
                onClick={() => !isCompleted(lesson._id) && onStartLesson(lesson)}
                className={styles.lessonCard}
                style={{
                  opacity: isCompleted(lesson._id) ? 0.5 : 1,
                  pointerEvents: isCompleted(lesson._id) ? 'none' : 'auto',
                  position: 'relative',
                }}
              >
                <div><strong>{lesson.title}</strong></div>
                <div>Уровень: {lesson.level}</div>
                {isCompleted(lesson._id) && (
                  <div className={styles.completedTag}>✔ Пройдено</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.lessonGrid}>
          {filteredLessons.map(lesson => (
            <div
              key={lesson._id}
              onClick={() => !isCompleted(lesson._id) && onStartLesson(lesson)}
              className={styles.lessonCard}
              style={{
                opacity: isCompleted(lesson._id) ? 0.5 : 1,
                pointerEvents: isCompleted(lesson._id) ? 'none' : 'auto',
                position: 'relative',
              }}
            >
              <div><strong>{lesson.title}</strong></div>
              <div>Уровень: {lesson.level}</div>
              {isCompleted(lesson._id) && (
                <div className={styles.completedTag}>✔ Пройдено</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Новая секция: Игры с картинками */}
      <h2 className={styles.title} style={{ marginTop: '50px' }}>ИГРЫ С КАРТИНКАМИ</h2>
      <p className={styles.subtitle}>
        Здесь вы будете угадывать слова по картинке.
      </p>

      <div className={styles.lessonGrid} style={{ marginTop: '20px' }}>
        {imageGames.map((lesson) => (
          <div
            key={lesson._id}
            onClick={() => onStartLesson(lesson)}
            className={styles.lessonCard}
          >
            <div><strong>{lesson.title}</strong></div>
            <div>Уровень: {lesson.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
