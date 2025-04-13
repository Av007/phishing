import AuthProvider from "../provider/AuthProvider";
import Routes from "../routers";

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
