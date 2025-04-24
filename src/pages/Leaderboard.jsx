import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/top')
      .then(res => res.json())
      .then(setLeaders)
      .catch(err => console.error('Ошибка при загрузке лидеров:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏆 Лидерборд</h2>
      <div className={styles.list}>
        {leaders.map((user, i) => {
          const firstLetter = user.email?.charAt(0)?.toUpperCase() || '?';
          const username = user.email?.split('@')[0] || 'User';
          const date = new Date(user.createdAt).toLocaleDateString();

          return (
            <div key={user._id} className={styles.card}>
              <div className={styles.rank}>#{i + 1}</div>
              <div className={styles.avatar}>{firstLetter}</div>
              <div className={styles.info}>
                <div className={styles.username}>{username}</div>
                <div className={styles.meta}>XP: {user.xp} | Стаreak: {user.streak}</div>
                <div className={styles.meta}>Регистрация: {date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
