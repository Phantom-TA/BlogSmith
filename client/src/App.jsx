import { BrowserRouter as Router } from 'react-router';
import AppRoutes from './AppRoutes.jsx';
import { AuthProvider } from './context/authContext.jsx';
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
