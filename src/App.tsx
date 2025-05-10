import "./fix-leaflet-icons";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Home />
      </main>
    </div>
  );
}

export default App;
