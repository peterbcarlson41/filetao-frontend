import "./App.css";
import Navbar from "@/components/common/Navbar";
import Tao from "@/components/common/Tao";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="flex flex-row items-center sm:text-9xl text-7xl font-bold text-center text-gray-800 drop-shadow-[0_5px_3px_rgba(0,0,0,0.7)]">
          File
          <Tao className="sm:h-24 sm:w-24 h-14 w-14" />
        </h1>
      </div>
    </>
  );
}

export default App;
