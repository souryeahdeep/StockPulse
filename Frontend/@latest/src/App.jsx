import "./App.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Landing from "./components/landing";
import SignUp from "./components/signup";
import Login from "./components/login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
