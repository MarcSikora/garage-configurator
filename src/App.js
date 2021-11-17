import './App.css';
import Display from './compontents/Display';
import Settings from './compontents/Settings';
import { useSelector } from 'react-redux';

function App() {
  const parameters = useSelector(state => state.parameters);

  return (
    <div className="App">
      <Display parameters={parameters}></Display>
      <Settings parameters={parameters}></Settings>
    </div>
  );
}

export default App;
