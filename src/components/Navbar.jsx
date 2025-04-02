// src/components/Navbar.jsx
import styles from './Navbar.module.css';
import HeaderProfile from './HeaderProfile';

const Navbar = ({ currentPage, setView, user }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <button
          className={currentPage === 'home' ? styles.active : ''}
          onClick={() => setView('home')}
        >
          Игры
        </button>
        <button
          className={currentPage === 'training' ? styles.active : ''}
          onClick={() => setView('training')}
        >
          Обучение
        </button>
        <button
          className={currentPage === 'leaderboard' ? styles.active : ''}
          onClick={() => setView('leaderboard')}
        >
          Топ игроков
        </button>
      </div>
      <div className={styles.profileRight}>
        <HeaderProfile user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
