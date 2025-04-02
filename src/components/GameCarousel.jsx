import styles from './GameCarousel.module.css';

const getCardColor = (level) => {
  if (level === 'Intermediate') return '#fff3cd'; // light yellow
  if (level === 'Advanced') return '#f8d7da';     // light red
  return '#ffffff';
};

const isLocked = (level, xp) => {
  if (level === 'Intermediate') return xp < 3;
  if (level === 'Advanced') return xp < 5;
  return false;
};

const GameCarousel = ({ lessons, onStart, user }) => {
  const isCompleted = (lessonId) => user?.completedLessons?.includes(lessonId);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.scrollArea}>
        {lessons.map((lesson) => {
          const locked = isLocked(lesson.level, user?.xp || 0);
          const completed = isCompleted(lesson._id);
          return (
            <div
              key={lesson._id}
              className={styles.card}
              style={{
                backgroundColor: getCardColor(lesson.level),
                opacity: locked || completed ? 0.5 : 1,
                pointerEvents: locked || completed ? 'none' : 'auto',
              }}
              onClick={() => !locked && onStart(lesson)}
            >
              <div><strong>{lesson.title}</strong></div>
              <div className={styles.level}>Уровень: {lesson.level}</div>
              {locked && <div className={styles.lockedTag}>🔒 Недоступно</div>}
              {completed && <div className={styles.completedTag}>✔ Пройдено</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameCarousel;
