import './App.css';
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Layout from './pages/layout'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Group from './pages/group';
import Role from './pages/role'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route index element={<Dashboard />} />
          <Route path='group' element={<Group />} />
          <Route path='role' element={<Role />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
