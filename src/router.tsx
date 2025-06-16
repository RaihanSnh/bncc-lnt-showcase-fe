import {
  RootRoute,
  Route,
  Router,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';

import App from './App';
import Home from './pages/Home';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import VerifyPage from './pages/VerifyPage';
import LandingPage from './pages/LandingPage';

const rootRoute = new RootRoute({
  component: App,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home,
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const projectDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectDetailPage,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

const verifyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/admin/verify',
  component: VerifyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  projectDetailRoute,
  profileRoute,
  loginRoute,
  registerRoute,
  uploadRoute,
  verifyRoute,
]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
