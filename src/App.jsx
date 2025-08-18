import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DocumentPage from './components/DocumentPage';
import TextoraLanding from "./components/TextoraLanding";
import './index.css';
import NotFoundPage from "./components/NotFoundPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doc/:docId" element={<DocumentPage />} />
        <Route path="/" element={<TextoraLanding />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/document-not-found" element={<NotFoundPage type="Document" />} />
      </Routes>
    </Router>
  );
}

export default App;
