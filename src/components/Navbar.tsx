import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  // We can't use useLocation here easily without prop drilling, so localStorage check is fine
  // for this component's scope.
  const userJSON = localStorage.getItem('user');
  let user = null;
  if (userJSON) {
    try {
      user = JSON.parse(userJSON);
    } catch (e) {
      console.error("Failed to parse user JSON from localStorage", e);
      // Handle corrupted data by clearing it
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate({ to: '/' }); // Redirect to landing page on logout
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            BNCC Showcase
          </Link>
        </motion.div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex items-center space-x-6">
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Home</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Projects</Link>
              </motion.li>
              
              {user && (
                <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/upload" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Upload Project</Link>
                </motion.li>
              )}
  
              {user?.role === 'admin' && (
                <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/admin/verify" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Admin Panel</Link>
                </motion.li>
              )}
            </ul>
          </nav>

          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Profile</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="font-medium"
                >
                  Logout
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Login</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link to="/register" className="flex items-center gap-1">
                    Register <ChevronRight size={16} />
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 