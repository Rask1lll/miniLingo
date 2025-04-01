import { useState, useRef } from 'react';
import styles from './HeaderProfile.module.css';

const HeaderProfile = ({ user }) => {
  const [show, setShow] = useState(false);
  const timeout = useRef();

  const firstLetter = user?.email?.charAt(0)?.toUpperCase() || '?';

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'неизвестно';

  const level = user?.xp ? Math.floor(Math.sqrt(user.xp)) + 1 : 1;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setShow(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setShow(false), 1000);
  };

  return (
    <div
        className={`${styles.wrapper} ${show ? styles.wrapperActive : ''}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        >
      <div className={styles.avatar}>
        {firstLetter}
      </div>

      <div className={styles.popup}>
        <div><strong>{user.email}</strong></div>
        <div>Уровень: {level}</div>
        <div>XP: {user.xp}</div>
        <div>🔥 Streak: {user.streak}</div>
        <div>Регистрация: {formattedDate}</div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
};

export default HeaderProfile;
