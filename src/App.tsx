import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import BrowseCards from './pages/BrowseCards';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/cards" element={<BrowseCards />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
