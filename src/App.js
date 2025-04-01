import { useEffect, useState } from 'react';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import Register from './pages/Register';
import Login from './pages/Login';
import HeaderProfile from './components/HeaderProfile';

function App() {
  const [user, setUser] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [view, setView] = useState('home');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setView('login');
      return;
    }

    fetch(`http://localhost:5000/api/user/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Получен профиль:', data);
        setUser({ ...data, id: userId });
        setView('home');
      })
      .catch(err => {
        console.error('Ошибка при получении профиля:', err);
        localStorage.removeItem('userId');
        setUser(null);
        setView('login');
      });
  }, []);

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

  if (view === 'login') return <Login onSwitch={setView} />;
  if (view === 'register') return <Register onSwitch={setView} />;
  if (!user) return <div className="p-4">Загрузка профиля...</div>;
  return (
    <div className="min-h-screen bg-gray-100 relative px-4 pt-16">
  <HeaderProfile user={user} />
  
  <div className="max-w-screen-md mx-auto bg-white p-6 rounded shadow">
    {!currentLesson ? (
      <Home
        user={user}
        onStartLesson={handleStartLesson}
        onLogout={handleLogout}
      />
    ) : (
      <LessonPage
        lesson={currentLesson}
        user={user}
        updateUser={setUser}
      />
    )}
  </div>
</div>
  );
}

export default App;
