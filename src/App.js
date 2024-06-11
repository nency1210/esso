import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TillForm from './TillForm';
import LottoForm from './LottoForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TillForm />} />
          <Route path="/lotto" element={<LottoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
