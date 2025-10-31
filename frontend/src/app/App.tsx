import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from '@/router/AppRouter';
import AppShell from '@/components/app-shell/AppShell';
import LoadingScreen from '@/components/common/LoadingScreen';
import ProjectModal from '@/components/modals/ProjectModal';
import TaskModal from '@/components/modals/TaskModal';

const App = () => (
  <AppShell>
    <Suspense fallback={<LoadingScreen message="Loading application" />}>
      <AppRouter />
    </Suspense>
    <ProjectModal />
    <TaskModal />
    <Toaster position="bottom-right" />
  </AppShell>
);

export default App;
