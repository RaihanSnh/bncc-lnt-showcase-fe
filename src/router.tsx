import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import Root from './App';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import Home from './pages/Home';

const rootRoute = createRootRoute({
  component: Root, 
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/', 
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login', 
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'upload', 
  component: UploadPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  uploadRoute,
]);

const router = createRouter({
  routeTree,
});

export default router;