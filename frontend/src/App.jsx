import Home from './pages/Home.jsx';
import SecPage from './pages/secPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/secPage" element={<SecPage/>} />
      </Routes>
    </Router>
  )
}

export default App
