import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import Workflows from './pages/Workflows';
import AIInsights from './pages/AIInsights';
import Companies from './pages/Companies';
import Inbox from './pages/Inbox';
import Activities from './pages/Activities';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import { Card, Button } from './components/UI';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppShell title="Dashboard">
                    <Dashboard />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads" 
              element={
                <ProtectedRoute>
                  <AppShell title="Leads">
                    <Leads />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contacts" 
              element={
                <ProtectedRoute>
                  <AppShell title="Contacts">
                    <Contacts />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute>
                  <AppShell title="Accounts">
                    <Companies />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/deals" 
              element={
                <ProtectedRoute>
                  <AppShell title="Pipeline">
                    <Deals />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inbox" 
              element={
                <ProtectedRoute>
                  <AppShell title="Inbox">
                    <Inbox />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activities" 
              element={
                <ProtectedRoute>
                  <AppShell title="Activity Hub">
                    <Activities />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <AppShell title="Tasks">
                    <Tasks />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute>
                  <AppShell title="Documents">
                    <Documents />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <AppShell title="Reports">
                    <Reports />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workflows" 
              element={
                <ProtectedRoute>
                  <AppShell title="Workflows">
                    <Workflows />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute>
                  <AppShell title="AI Insights">
                    <AIInsights />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/team" 
              element={
                <ProtectedRoute>
                  <AppShell title="Team">
                    <Team />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <AppShell title="Settings">
                    <Settings />
                  </AppShell>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
