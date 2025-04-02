import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import GameCarousel from '../components/GameCarousel';

const Home = ({ onStartLesson, user }) => {
  const [lessons, setLessons] = useState([]);
  const [imageGames, setImageGames] = useState([]);
  const [matchingGames, setMatchingGames] = useState([]);

  const [filter, setFilter] = useState('all');
  const [imageFilter, setImageFilter] = useState('all');
  const [matchingFilter, setMatchingFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/lessons')
      .then(res => setLessons(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/lessons/image')
      .then(res => setImageGames(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/lessons/matching')
      .then(res => setMatchingGames(res.data))
      .catch(err => console.error(err));
  }, []);

  const isCompleted = (lessonId) => user.completedLessons?.includes(lessonId);

  const getCardColor = (level) => {
    if (level === 'Intermediate') return '#fff3cd'; // light yellow
    if (level === 'Advanced') return '#f8d7da';     // light red
    return '#ffffff';                               // default white
  };

  const isLocked = (level) => {
    if (level === 'Intermediate') return user.xp < 3;
    if (level === 'Advanced') return user.xp < 5;
    return false;
  };

  const renderLessonCards = (lessons) => (
    lessons.map((lesson) => {
      const locked = isLocked(lesson.level);
      const completed = isCompleted(lesson._id);
  
      let backgroundColor = '#ffffff'; // default white
      if (lesson.level === 'Intermediate') backgroundColor = '#fff3cd'; // yellow
      if (lesson.level === 'Advanced') backgroundColor = '#f8d7da'; // red
  
      return (
        <div
          key={lesson._id}
          onClick={() => !locked && onStartLesson(lesson)}
          className={styles.lessonCard}
          style={{
            backgroundColor,
            opacity: locked || completed ? 0.5 : 1,
            pointerEvents: locked || completed ? 'none' : 'auto',
            position: 'relative',
          }}
        >
          <div><strong>{lesson.title}</strong></div>
          <div>Уровень: {lesson.level}</div>
  
          {locked && <div className={styles.lockedTag}>🔒 Недоступно</div>}
          {completed && <div className={styles.completedTag}>✔ Пройдено</div>}
        </div>
      );
    })
  );
  

  const filteredLessons = lessons
    .filter(lesson => lesson.type === 'game')
    .filter(lesson => filter === 'all' ? true : lesson.level === filter);

  const filteredImageGames = imageGames
    .filter(lesson => imageFilter === 'all' ? true : lesson.level === imageFilter);

  const filteredMatchingGames = matchingGames
    .filter(lesson => matchingFilter === 'all' ? true : lesson.level === matchingFilter);

  return (
    <div className={styles.container}>
      {/* MINI GAMES */}
      <h2 className={styles.title}>МИНИ-ИГРЫ</h2>
      <p className={styles.subtitle}>Эти игры помогут запомнить слова в лёгкой и интерактивной форме.</p>
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
        <GameCarousel lessons={filteredLessons} onStart={onStartLesson} user={user} />
      ) : (
        <div className={styles.lessonGrid}>{renderLessonCards(filteredLessons)}</div>
      )}

      {/* IMAGE GAMES */}
      {/* IMAGE GAMES */}
<h2 className={styles.title} style={{ marginTop: '50px' }}>ИГРЫ С КАРТИНКАМИ</h2>
<p className={styles.subtitle}>Здесь вы будете угадывать слова по картинке.</p>

<div className={styles.filterButtons}>
  {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
    <button
      key={level}
      onClick={() => setImageFilter(level)}
      className={imageFilter === level ? styles.activeFilter : ''}
    >
      {level === 'all' ? 'Все' :
        level === 'Beginner' ? 'Лёгкие' :
        level === 'Intermediate' ? 'Средние' : 'Сложные'}
    </button>
  ))}
</div>

<GameCarousel
  lessons={filteredImageGames}
  onStart={onStartLesson}
  user={user} // Обязательно передай user, чтобы carousel знал уровень
/>


      {/* MATCHING GAMES */}
      <h2 className={styles.title} style={{ marginTop: '50px' }}>СОПОСТАВЛЕНИЕ СЛОВ</h2>
      <p className={styles.subtitle}>Сопоставьте английские слова с их переводами.</p>
      <div className={styles.filterButtons}>
        {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
          <button
            key={level}
            onClick={() => setMatchingFilter(level)}
            className={matchingFilter === level ? styles.activeFilter : ''}
          >
            {level === 'all' ? 'Все' :
              level === 'Beginner' ? 'Лёгкие' :
              level === 'Intermediate' ? 'Средние' : 'Сложные'}
          </button>
        ))}
      </div>
      {filteredMatchingGames.length > 6 ? (
        <GameCarousel lessons={filteredMatchingGames} onStart={onStartLesson} user={user} />
      ) : (
        <div className={styles.lessonGrid}>{renderLessonCards(filteredMatchingGames)}</div>
      )}
    </div>
  );
};

export default Home;
