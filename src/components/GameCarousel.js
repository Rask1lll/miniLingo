// components/GameCarousel.js
import styles from './GameCarousel.module.css';

const GameCarousel = ({ lessons, onStart }) => {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.scrollArea}>
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className={styles.card}
            onClick={() => onStart(lesson)}
          >
            <strong>{lesson.title}</strong>
            <div>Уровень: {lesson.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;
