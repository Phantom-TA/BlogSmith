import { BrowserRouter as Router } from 'react-router';
import AppRoutes from './AppRoutes.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { LikesProvider } from './context/LikesContext.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LikesProvider>
          <AppRoutes />
        </LikesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
