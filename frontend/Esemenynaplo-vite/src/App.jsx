import { useState, useEffect } from 'react'
import tailwindcss from '@tailwindcss/vite';

export default App;

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-xs">Frontend running</h1>
      <p>{message}</p>
    </div>
  );
}
