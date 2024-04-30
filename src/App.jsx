import "./App.css";
import Navbar from "@/components/common/Navbar";
import Tao from "@/components/common/Tao";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <Analytics/>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="flex flex-row items-center sm:text-9xl text-7xl font-bold text-center text-gray-800 drop-shadow-[0_5px_3px_rgba(0,0,0,0.7)]">
          <Tao className="sm:h-96 sm:w-96 h-48 w-48" />
        </h1>
      </div>
    </>
  );
}

export default App;
