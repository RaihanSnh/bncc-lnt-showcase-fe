import { Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

function App() {
  return (
    <div>
      <Outlet />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
