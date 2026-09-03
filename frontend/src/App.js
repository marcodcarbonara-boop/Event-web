import{BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';
//page & component
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import ChatPage from './pages/ChatPage'
function App() {
  const {user}= useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <div className='pages'>
          <Routes>
            <Route
            path='/'
            element={user?<Home />: <Navigate to= '/login'></Navigate>}
            />
            <Route
            path='/create'
            element={user ? <CreateEvent/>: <Navigate to="/login"></Navigate>}
            />
            <Route path="/chat" 
            element={user ? <ChatPage /> : <Navigate to="/login"></Navigate>} 
            />
            <Route
            path='/login'
            element={!user ?<Login />: <Navigate to="/"></Navigate>}
            />
            <Route
            path='/Signup'
            element={!user ?<Signup />: <Navigate to="/"></Navigate>}
            />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
