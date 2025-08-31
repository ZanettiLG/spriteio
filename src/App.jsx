import './App.css'
import { useState } from 'react';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CharacterSelector from './components/CharacterSelector';
import Switch from './components/Switch';

function App() {
  const [page, setPage] = useState("home");
  return (
    <Switch
      cases={{
        "home": <HomePage setPage={setPage} />,
        "game": <GamePage />,
        "character": <CharacterSelector setPage={setPage} />,
      }}
      value={page}
    />
  )
}

export default App
