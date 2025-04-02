import styles from './ImageGame.module.css';

const ImageGame = ({ wordObj, onSelect, selected }) => {
  if (!wordObj || !wordObj.word || !wordObj.image || !wordObj.options) return null;

  const isCorrect = selected === wordObj.word;

  return (
    <div className={styles.wrapper}>
      <img src={wordObj.image} alt={wordObj.word} className={styles.image} />
      <div className={styles.options}>
        {wordObj.options.map((opt, i) => (
          <button
            key={i}
            className={`${styles.optionBtn} ${
              selected
                ? opt === wordObj.word
                  ? styles.correct
                  : opt === selected
                  ? styles.incorrect
                  : ''
                : ''
            }`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};


export default ImageGame;
