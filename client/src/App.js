import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Private } from "./pages/Private";
import { Main } from "./pages/Main";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Protected } from "./pages/Protected.route";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigation } from "./components/Navigation";
function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/main" element={Protected(Main)} />
        <Route exact path="/private" element={Protected(Private)} />
      </Routes>
    </div>
  );
}

export default App;
