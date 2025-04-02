import { useState, useEffect, useRef } from 'react';
import styles from './MatchingGame.module.css';
import errorSound from '../../assets/sounds/error.mp3';

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const MatchingGame = ({ wordPairs, onComplete }) => {
  const [shuffledTranslations, setShuffledTranslations] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [colors, setColors] = useState({});
  const [shaking, setShaking] = useState({});
  const errorAudio = new Audio(errorSound);

  useEffect(() => {
    setShuffledTranslations(shuffleArray(wordPairs.map(w => w.translation)));
    setColors(generateColors(wordPairs.length));
  }, [wordPairs]);

  const generateColors = (count) => {
    const palette = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#3f51b5', '#009688', '#673ab7'];
    return wordPairs.reduce((acc, pair, i) => {
      acc[pair.word] = palette[i % palette.length];
      return acc;
    }, {});
  };

  const handleWordClick = (word) => {
    if (matches[word]) return;
    setSelectedWord(word);
  };

  const handleTranslationClick = (translation) => {
    if (!selectedWord) return;

    const correctTranslation = wordPairs.find(w => w.word === selectedWord)?.translation;

    if (translation === correctTranslation) {
      setMatches(prev => ({
        ...prev,
        [selectedWord]: translation
      }));
      setCorrectCount(prev => prev + 1); // Увеличиваем счётчик
    } else {
      errorAudio.play();
      setShaking(prev => ({
        ...prev,
        [translation]: true
      }));
      setTimeout(() => {
        setShaking(prev => ({
          ...prev,
          [translation]: false
        }));
      }, 500);

      setMatches(prev => ({
        ...prev,
        [selectedWord]: correctTranslation
      }));
    }

    setSelectedWord(null);
  };

  useEffect(() => {
    const allMatched = wordPairs.every(w => matches[w.word] === w.translation);
    if (Object.keys(matches).length === wordPairs.length && allMatched) {
      setCompleted(true);
      setTimeout(() => onComplete(correctCount), 1000); // Передаём именно correctCount
    }
  }, [matches, wordPairs, onComplete, correctCount]);

  return (
    <div className={styles.matchingContainer}>
      <div className={styles.columns}>
        <div className={styles.column}>
          {wordPairs.map(({ word }) => (
            <div
              key={word}
              className={`${styles.wordCard} ${selectedWord === word ? styles.selected : ''}`}
              style={{ backgroundColor: matches[word] ? colors[word] : '' }}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {shuffledTranslations.map((translation) => {
            const matchedWord = Object.keys(matches).find(word => matches[word] === translation);
            const isMatched = Boolean(matchedWord);
            const isShaking = shaking[translation];

            return (
              <div
                key={translation}
                className={`${styles.translationCard} ${isShaking ? styles.shake : ''}`}
                style={{
                  backgroundColor: isMatched ? colors[matchedWord] : ''
                }}
                onClick={() => handleTranslationClick(translation)}
              >
                {translation}
              </div>
            );
          })}
        </div>
      </div>

      {completed && (
        <div className={styles.successMessage}>✅ Отлично! Все пары сопоставлены!</div>
      )}
    </div>
  );
};

export default MatchingGame;
