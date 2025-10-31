import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import RequireAuth from './RequireAuth';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('@/pages/project-details/ProjectDetailsPage'));
const PersonalTasksPage = lazy(() => import('@/pages/personal-tasks/PersonalTasksPage'));
const CatalogsPage = lazy(() => import('@/pages/catalogs/CatalogsPage'));
const ArchivePage = lazy(() => import('@/pages/archive/ArchivePage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const InvitationPage = lazy(() => import('@/pages/invitation/InvitationPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const AppRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/auth',
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'reset', element: <ResetPasswordPage /> }
      ]
    },
    {
      element: <RequireAuth />,
      children: [
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/projects', element: <ProjectsPage /> },
        { path: '/projects/:projectId', element: <ProjectDetailsPage /> },
        { path: '/tasks', element: <PersonalTasksPage /> },
        { path: '/catalogs', element: <CatalogsPage /> },
        { path: '/archive', element: <ArchivePage /> },
        { path: '/profile', element: <ProfilePage /> },
        { path: '/invitation/:token?', element: <InvitationPage /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />
    }
  ]);

export default AppRouter;
