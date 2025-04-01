import { useState } from 'react';
import axios from 'axios';
import styles from './AuthForm.module.css';

const Register = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMsg('Пароли не совпадают');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', {
        email,
        password
      });

      setMsg('Регистрация успешна!');
      setTimeout(() => onSwitch('login'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <div className={styles.formTitle}>Регистрация</div>

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

        <input
          type="password"
          className={styles.input}
          placeholder="Подтверждение пароля"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>Зарегистрироваться</button>

        {msg && <div className={styles.message}>{msg}</div>}

        <div className={styles.switchText}>
          Уже есть аккаунт?
          <span className={styles.switchLink} onClick={() => onSwitch('login')}>
            Войти
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
