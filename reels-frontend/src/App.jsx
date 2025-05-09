import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [username, setUsername] = useState('');
  const [count, setCount] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('reels');
  const [results, setResults] = useState(null); // ✅ Nuevo estado
  const [showJson, setShowJson] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const baseURL = 'http://192.168.68.60:8000'; // Cambiar si es otra PC
    const endpointPath = endpoint === 'reels' ? '/scrape' : '/scrape-posts';
    const url = `${baseURL}${endpointPath}?username=${username}&cantidad=${count}`;

    try {
      const { data } = await axios.get(url);
      setResults(data); // ✅ Guardamos los datos
      console.log('Datos obtenidos:', data); // ✅ Verifica los datos en la consola
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const renderItems = () => {
    if (!results) return null;

    const items = endpoint === 'reels' ? results.reels : results.posts;

    return (
      <div className="results">
        {items.map((item, index) => (
          <div className="card" key={index}>
            <a href={item.url} target="_blank" rel="noreferrer">
              <strong>{item.titulo || '(sin título)'}</strong>
            </a>
            {item.comentarios?.length > 0 && (
  <ul>
    {item.comentarios.map((c, i) => (
      <li key={i} style={{ marginLeft: '1rem', fontStyle: 'italic' }}>{c}</li>
    ))}
  </ul>
)}
            <p>❤️ Likes: {item.likes}</p>
            {item.reproducciones && <p>▶️ Reproducciones: {item.reproducciones}</p>}
            <p>📅 Fecha: {item.fecha}</p>
            {item.transcripcion && (
              <details>
                <summary>📝 Transcripción</summary>
                <p>{item.transcripcion}</p>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={darkMode ? 'app dark' : 'app light'}>
    <img src="/image.png" alt="Logo" className="logo" />

      <div className="top-container">
        <div className="container">
          <h1>Scraper de Reels / Posts</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuario de Instagram"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
            <div className="endpoint-selector">
              <label>
                <input
                  type="radio"
                  name="endpoint"
                  value="reels"
                  checked={endpoint === 'reels'}
                  onChange={() => setEndpoint('reels')}
                />
                Reels
              </label>
              <label>
                <input
                  type="radio"
                  name="endpoint"
                  value="posts"
                  checked={endpoint === 'posts'}
                  onChange={() => setEndpoint('posts')}
                />
                Posts
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Obtener'}
            </button>
            <button
  type="button"
  style={{ backgroundColor: '#555' }}
  onClick={() => setShowJson((prev) => !prev)}
>
  {showJson ? 'Ocultar JSON' : 'Ver JSON'}
</button>

          </form>
        </div>
      </div>
  
      {/* ✅ Cards debajo del buscador */}
      <div className="cards-container">{renderItems()}</div>
      {showJson && results && (
  <pre style={{
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
    color: darkMode ? '#fff' : '#000',
    maxWidth: '1200px',
    overflowX: 'auto',
    borderRadius: '8px',
    fontSize: '0.85rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }}>
    {JSON.stringify(results, null, 2)}
  </pre>
)}

  
      <div className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        Cambiar a modo {darkMode ? 'claro' : 'oscuro'}
      </div>
    </div>
  );
  
  
}
