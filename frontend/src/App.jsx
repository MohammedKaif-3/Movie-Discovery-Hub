import { AppProvider } from './context/AppContext.jsx';
import { MovieHub } from './pages/MovieHub.jsx';
import './App.css';

const App = () => (
  <AppProvider>
    <MovieHub />
  </AppProvider>
);

export default App;
