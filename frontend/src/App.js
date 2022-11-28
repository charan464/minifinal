import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {  Route, Routes,Router} from 'react-router-dom';
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage';





function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/chats" element={<ChatPage/>} />
      </Routes>
     
       
    </div>
  );
}

export default App;
