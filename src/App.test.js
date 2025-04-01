import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {isLogin ? <Login /> : <Register />}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 hover:underline text-sm"
        >
          {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}

export default App;
