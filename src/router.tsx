import { Route, Router, RootRoute } from '@tanstack/react-router';

import Root from './App';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import VerifyPage from './pages/VerifyPage';
import Home from './pages/Home';
import ProjectDetailPage from './pages/ProjectDetailPage';

const rootRoute = new RootRoute({
  component: Root,
});

// Landing page route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
  beforeLoad: () => { // Protect landing page from admin users
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return null; // Allow access if not logged in
    }

    try {
      const user = JSON.parse(userJSON);
      // Redirect admin users to admin page
      if (user.role === 'admin') {
        return { to: '/admin/verify' };
      }
      return null; // Allow access if logged in as regular user
    } catch (err) {
      localStorage.removeItem('user'); // Clear invalid user data
      return null;
    }
  },
});

// Home page (project showcase) route
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home,
  beforeLoad: () => { // Basic frontend protection for home route
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return { to: '/login' }; // Redirect to login if not logged in
    }

    try {
      const user = JSON.parse(userJSON);
      // Redirect admin users to admin page
      if (user.role === 'admin') {
        return { to: '/admin/verify' };
      }
      return null; // Allow access if logged in as regular user
    } catch (err) {
      localStorage.removeItem('user'); // Clear invalid user data
      return { to: '/login' };
    }
  },
});

// Project detail page route
const projectDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectDetailPage,
  beforeLoad: ({ params }) => { // Basic frontend protection for project detail route
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return { to: '/login' }; // Redirect to login if not logged in
    }

    try {
      const user = JSON.parse(userJSON);
      // Redirect admin users to admin page
      if (user.role === 'admin') {
        return { to: '/admin/verify' };
      }
      return null; // Allow access if logged in as regular user
    } catch (err) {
      localStorage.removeItem('user'); // Clear invalid user data
      return { to: '/login' };
    }
  },
});

// Authentication routes
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
  beforeLoad: () => {
    // If already logged in as admin, redirect to admin page
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        const user = JSON.parse(userJSON);
        if (user.role === 'admin') {
          return { to: '/admin/verify' };
        } else {
          return { to: '/home' }; // Regular users go to home
        }
      } catch (err) {
        localStorage.removeItem('user'); // Clear invalid user data
      }
    }
    return null; // Allow access if not logged in
  },
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterPage,
  beforeLoad: () => {
    // If already logged in, redirect appropriately
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      try {
        const user = JSON.parse(userJSON);
        if (user.role === 'admin') {
          return { to: '/admin/verify' };
        } else {
          return { to: '/home' }; // Regular users go to home
        }
      } catch (err) {
        localStorage.removeItem('user'); // Clear invalid user data
      }
    }
    return null; // Allow access if not logged in
  },
});

// Protected user routes
const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'upload',
  component: UploadPage,
  beforeLoad: () => { // Basic frontend protection for upload route
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return { to: '/login' }; // Redirect to login if not logged in
    }

    try {
      const user = JSON.parse(userJSON);
      // Redirect admin users to admin page
      if (user.role === 'admin') {
        return { to: '/admin/verify' };
      }
      return null; // Allow access if logged in as regular user
    } catch (err) {
      localStorage.removeItem('user'); // Clear invalid user data
      return { to: '/login' };
    }
  },
});

// Protected admin routes
const verifyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'admin/verify',
  component: VerifyPage,
  beforeLoad: () => { // Basic frontend protection for admin verify route
    const userJSON = localStorage.getItem('user');
    if (!userJSON) {
      return { to: '/login' }; // Redirect to login if not logged in
    }

    try {
      const user = JSON.parse(userJSON);
      if (user.role !== 'admin') {
        return { to: '/home' }; // Redirect to home page if not admin
      }
      return null; // Allow access if admin
    } catch (err) {
      localStorage.removeItem('user'); // Clear invalid user data
      return { to: '/login' };
    }
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  projectDetailRoute,
  loginRoute,
  registerRoute,
  uploadRoute,
  verifyRoute,
]);

const router = new Router({
  routeTree,
});

export default router;
