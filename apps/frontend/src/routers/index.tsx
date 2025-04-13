import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Homepage from '../pages/Homepage';
import { ProtectedRoute } from './protectedRoute';
import Logout from '../pages/Logout';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
