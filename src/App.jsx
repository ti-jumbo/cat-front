import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./component/login/SignInPage";
import Register from "./component/login/Register";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<h1>Pagina não encontrada</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
