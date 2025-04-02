import { useEffect, useState } from 'react';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Leaderboard from './pages/Leaderboard';


function App() {
  const [user, setUser] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [view, setView] = useState('loading');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setView('login');
      return;
    }

    fetch(`http://localhost:5000/api/user/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser({ ...data, id: userId });
        setView('home');
      })
      .catch(() => {
        localStorage.removeItem('userId');
        setUser(null);
        setView('login');
      });
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('userId', userData._id);
    setUser({ ...userData, id: userData._id });
    setView('home');
  };

  const handleStartLesson = async (lessonInfo) => {
    const res = await fetch(`http://localhost:5000/api/lessons/${lessonInfo._id}`);
    const fullLesson = await res.json();
    setCurrentLesson(fullLesson);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setView('login');
  };

  if (view === 'loading') return <div className="p-4">Загрузка...</div>;
  if (view === 'login') return <Login onSwitch={setView} onLogin={handleLogin} />;
  if (view === 'register') return <Register onSwitch={setView} />;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
    <Navbar currentPage={view} setView={setView} user={user} />

      <div className="max-w-screen-md mx-auto bg-white p-6 rounded shadow mt-4">
        {currentLesson ? (
          <LessonPage
            lesson={currentLesson}
            user={user}
            updateUser={setUser}
          />
        ) : view === 'home' ? (
          <Home
            user={user}
            onStartLesson={handleStartLesson}
            onLogout={handleLogout}
          />
        ) : view === 'training' ? (
          <div>Страница обучения (в разработке)</div>
        ) : view === 'leaderboard' ? (
          <div>Топ игроков (в разработке)</div>
        ) : null}
        {view === 'leaderboard' && <Leaderboard />}

      </div>
    </div>
  );
}

export default App;
