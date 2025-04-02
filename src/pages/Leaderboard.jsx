import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/user/top')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error('Ошибка при загрузке лидеров:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏆 Лидерборд</h2>
      <div className={styles.list}>
        {students.map((student, i) => (
          <div key={student._id} className={styles.card}>
            <div className={styles.rank}>#{i + 1}</div>
            <img src={student.avatar || '/default-avatar.png'} alt="avatar" className={styles.avatar} />
            <div className={styles.info}>
              <div className={styles.name}>{student.username}</div>
              <div>XP: {student.xp}</div>
              <div>Регистрация: {new Date(student.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
