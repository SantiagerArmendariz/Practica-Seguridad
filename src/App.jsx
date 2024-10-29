import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <>
          <Register setUser={setUser} />
          <Login setUser={setUser} />
        </>
      ) : (
        <Chat user={user} />
      )}
    </div>
  );
}

export default App;