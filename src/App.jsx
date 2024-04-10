import "./App.css";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-9xl font-bold text-center text-gray-800 drop-shadow-[0_5px_3px_rgba(0,0,0,0.7)]">
          FileTao
        </h1>
      </div>
    </>
  );
}

export default App;
