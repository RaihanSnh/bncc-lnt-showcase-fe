import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Users, Layers, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Navigation - Glass Morphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                BNCC Showcase
              </h1>
            </motion.div>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Home</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Projects</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Login</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center gap-1">
                  Register <ChevronRight size={16} />
                </Link>
              </motion.li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section with 3D Parallax Effect */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" 
               style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"
               style={{ transform: `translateY(${scrollY * -0.05}px)` }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-3xl blur-3xl opacity-70"></div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Showcase Your Final Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A platform for BNCC LnT students to showcase their final projects and get feedback from peers across all regions.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="rounded-full px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                  <Link to="/register" className="flex items-center gap-2">Get Started <ChevronRight size={18} /></Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 border-2 hover:bg-blue-50 transition-all duration-300">
                  <Link to="/login">Log In</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features with Glass Cards */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-4">BNCC LnT Showcase </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover the benefits of showcasing your projects on our platform</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Code className="text-blue-600" size={24} />
                </div>
                <CardTitle className="text-xl font-bold">Share Your Projects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600">Upload your projects with detailed descriptions, images, GitHub links, and more.</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <Users className="text-indigo-600" size={24} />
                </div>
                <CardTitle className="text-xl font-bold">Connect with Peers</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600">Leave comments and feedback on projects from students across all BNCC regions.</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Layers className="text-purple-600" size={24} />
                </div>
                <CardTitle className="text-xl font-bold">Build Your Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600">Showcase your technical skills and creativity to the BNCC community.</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Regions with 3D Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold mb-4">Across All BNCC Regions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Connect with students from different campuses</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Kemanggisan (KMG)", color: "from-blue-500 to-blue-600" },
              { name: "Alam Sutera (ALS)", color: "from-indigo-500 to-indigo-600" },
              { name: "Bandung (BDG)", color: "from-purple-500 to-purple-600" },
              { name: "Malang (MLG)", color: "from-pink-500 to-pink-600" }
            ].map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform perspective-1000">
                  <div className={`h-24 bg-gradient-to-r ${region.color} flex items-center justify-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-xl">{region.name.split(' ')[1].replace(/[()]/g, '')}</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="font-bold text-xl mb-2">{region.name}</h4>
                    <p className="text-gray-600 text-sm">Join students from {region.name.split(' ')[0]} campus</p>
                    <Button variant="ghost" size="sm" className="mt-4 rounded-full">
                      <ExternalLink size={16} className="mr-2" /> Explore Projects
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with Modern Design */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">BNCC Showcase</h2>
              <p className="text-gray-300 mb-6 max-w-md">A platform for BNCC LnT students to showcase their final projects and get feedback from peers across all regions.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Register</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@bncc.net</li>
                <li className="text-gray-400">Phone: +62 21 123 4567</li>
                <li className="text-gray-400">Address: BNCC Kemanggisan, Jakarta</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BNCC LnT Showcase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
