import { Router, Route } from 'wouter';
import Game from './pages/Game';

function App() {
  return (
    <Router>
      <Route path="/">
        <Game />
      </Route>
    </Router>
  );
}

export default App;
