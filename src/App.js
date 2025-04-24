import { useEffect, useState } from 'react';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Leaderboard from './pages/Leaderboard';
import HeaderProfile from './components/HeaderProfile';
import Learning from './pages/Learning';
import LearningLessonPage from './pages/LearningLessonPage';

function App() {
  const [user, setUser] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentLearningLesson, setCurrentLearningLesson] = useState(null);
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

  const showNavbar = view !== 'login' && view !== 'register' && !currentLesson && !currentLearningLesson;
  const showHeaderProfile = user && view !== 'login' && view !== 'register' && !currentLesson && !currentLearningLesson;

  return (
    <div className="min-h-screen bg-gray-100 pt-16 relative">
      {showNavbar && <Navbar currentPage={view} setView={setView} user={user} />}
      {showHeaderProfile && (
        <div className="absolute top-4 right-4">
          <HeaderProfile user={user} />
        </div>
      )}

      <div className="max-w-screen-md mx-auto bg-white p-6 rounded shadow mt-4">
        {view === 'loading' && <div className="p-4">Загрузка...</div>}
        {view === 'login' && <Login onSwitch={setView} onLogin={handleLogin} />}
        {view === 'register' && <Register onSwitch={setView} />}

        {currentLesson ? (
          <LessonPage
            lesson={currentLesson}
            user={user}
            updateUser={setUser}
          />
        ) : currentLearningLesson ? (
          <LearningLessonPage
  lesson={currentLearningLesson}
  setView={setView}
  setCurrentLearningLesson={setCurrentLearningLesson}
/>


        ) : view === 'home' ? (
          <Home
            user={user}
            onStartLesson={handleStartLesson}
            onLogout={handleLogout}
          />
        ) : view === 'training' ? (
          <Learning onStartLearningLesson={(lesson) => {
            setCurrentLearningLesson(lesson);
            setView('training');
          }} />
        ) : view === 'leaderboard' ? (
          <Leaderboard />
        ) : null}
      </div>
    </div>
  );
}

export default App;
