import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page';
import TrialDetailView from './trials/[trialId]/page';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/trials/:id" element={<TrialDetailView />} />
        </Routes>
    </Router>
  );
}

export default App;