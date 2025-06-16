import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { User, Lock, Mail, MapPin, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!username || !password || !email || !region) {
      toast.error('All fields are required.');
      setIsLoading(false);
      return;
    }

    const promise = () => new Promise(async (resolve, reject) => {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        reject(new Error(data.error || 'Registration failed.'));
      } else {
        setSuccessMessage('Registration successful! Please log in.');
        setUsername('');
        setPassword('');
        setEmail('');
        setRegion('');

        setTimeout(() => navigate({ to: '/login' }), 2000);
        resolve(data);
      }
    });

    toast.promise(promise, {
      loading: 'Creating account...',
      success: 'Registration successful! Please log in.',
      error: (err) => err.message,
    });

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/90 border border-slate-200/50 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

            <CardHeader className="space-y-1 pb-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
              >
                <User className="text-white" size={28} />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Create User Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Join the BNCC Showcase community as a user to upload and showcase your projects
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-6 border border-red-200 bg-red-50/50 backdrop-blur-sm">
                    <AlertDescription className="flex items-center gap-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="mb-6 border border-green-200 bg-green-50/50 backdrop-blur-sm text-green-700">
                    <AlertDescription className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Label htmlFor="username" className="text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                    placeholder="Enter a username"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                    placeholder="Enter your email"
                  />
                </motion.div>
                
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-blue-600" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-3 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                      placeholder="Enter a password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-0 h-full px-3 text-gray-500 hover:text-blue-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Label htmlFor="region" className="text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    Region
                  </Label>
                  <Select onValueChange={setRegion} value={region}>
                    <SelectTrigger className="w-full pl-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KMG">KMG (Kemanggisan)</SelectItem>
                      <SelectItem value="ALS">ALS (Alam Sutera)</SelectItem>
                      <SelectItem value="BDG">BDG (Bandung)</SelectItem>
                      <SelectItem value="MLG">MLG (Malang)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="pt-2"
                >
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-gray-600"
              >
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Sign in
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default RegisterPage;
