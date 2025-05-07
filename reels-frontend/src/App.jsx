import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState([]);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/scrape`, {
        params: { username, cantidad },
      });
      setReels(res.data.reels);
    } catch (err) {
      alert('Error al obtener datos. Verificá si la API está corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Scraper de Reels</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Usuario de Instagram"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          min={1}
          max={10}
        />
        <button onClick={handleScrape} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Reels'}
        </button>
      </div>

      <div className="resultados">
        {reels.map((reel, i) => (
          <div key={i} className="card">
            <a href={reel.url} target="_blank" rel="noopener noreferrer">
              {reel.titulo || 'Reel sin título'}
            </a>
            <p>📅 {reel.fecha}</p>
            <p>❤️ {reel.likes}</p>
            <p>👁 {reel.reproducciones}</p>
            <ul>
              {reel.comentarios.map((c, j) => (
                <li key={j}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
