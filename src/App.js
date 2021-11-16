import './App.css';
import Display from './compontents/Display';
import Settings from './compontents/Settings';
import Parameters from './logic/Parameters'

function App() {
  const parameters = new Parameters();

  return (
    <div className="App">
      <Display parameters={parameters}></Display>
      <Settings parameters={parameters}></Settings>
    </div>
  );
}

export default App;
