import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;