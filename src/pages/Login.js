import { useState } from 'react';
import axios from 'axios';
import styles from './AuthForm.module.css';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      localStorage.setItem('userId', res.data.userId);
      window.location.reload();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <div className={styles.formTitle}>Вход</div>

        <input
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>Войти</button>

        {msg && <div className={styles.message}>{msg}</div>}

        <div className={styles.switchText}>
          Нет аккаунта?
          <span className={styles.switchLink} onClick={() => onSwitch('register')}>
            Зарегистрироваться
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
