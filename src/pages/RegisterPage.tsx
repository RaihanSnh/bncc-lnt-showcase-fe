import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !password || !email || !region) {
      setError('Semua field harus diisi.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', { // Sesuaikan URL backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registrasi gagal.'); // Tampilkan pesan error dari backend atau pesan default
      } else {
        setSuccessMessage('Registrasi berhasil! Silakan login.');
        // Reset form setelah berhasil register
        setUsername('');
        setPassword('');
        setEmail('');
        setRegion('');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="region">Region:</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Pilih Region</option>
            <option value="KMG">KMG (Kemanggisan)</option>
            <option value="ALS">ALS (Alam Sutera)</option>
            <option value="BDG">BDG (Bandung)</option>
            <option value="MLG">MLG (Malang)</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;