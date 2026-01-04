import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Messages from './pages/Messages.jsx';
import History from './pages/History.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  );
}
