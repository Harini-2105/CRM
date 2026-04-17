import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import Workflows from './pages/Workflows';
import AIInsights from './pages/AIInsights';
import Companies from './pages/Companies';
import Inbox from './pages/Inbox';
import { Card, Button } from './components/UI';

// Basic Placeholder Page
const PlaceholderPage = ({ name }: { name: string }) => (
  <AppShell title={name}>
    <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
        <span className="text-2xl font-bold">O</span>
      </div>
      <h1 className="text-2xl font-display">{name}</h1>
      <p className="text-text-secondary max-w-sm">
        We're currently building the {name} core module. This will be part of the Ozofi premium suite.
      </p>
      <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
    </Card>
  </AppShell>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <AppShell title="Dashboard">
              <Dashboard />
            </AppShell>
          } 
        />
        <Route 
          path="/leads" 
          element={
            <AppShell title="Leads">
              <Leads />
            </AppShell>
          } 
        />
        <Route 
          path="/contacts" 
          element={
            <AppShell title="Contacts">
              <Contacts />
            </AppShell>
          } 
        />
        <Route 
          path="/companies" 
          element={
            <AppShell title="Accounts">
              <Companies />
            </AppShell>
          } 
        />
        <Route 
          path="/deals" 
          element={
            <AppShell title="Pipeline">
              <Deals />
            </AppShell>
          } 
        />
        <Route 
          path="/inbox" 
          element={
            <AppShell title="Inbox">
              <Inbox />
            </AppShell>
          } 
        />
        <Route 
          path="/activities" 
          element={<PlaceholderPage name="Activities" />} 
        />
        <Route 
          path="/tasks" 
          element={<PlaceholderPage name="Tasks" />} 
        />
        <Route 
          path="/documents" 
          element={<PlaceholderPage name="Documents" />} 
        />
        <Route 
          path="/reports" 
          element={<PlaceholderPage name="Reports" />} 
        />
        <Route 
          path="/workflows" 
          element={
            <AppShell title="Workflows">
              <Workflows />
            </AppShell>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <AppShell title="AI Insights">
              <AIInsights />
            </AppShell>
          } 
        />
        <Route 
          path="/team" 
          element={<PlaceholderPage name="Team" />} 
        />
        <Route 
          path="/settings" 
          element={<PlaceholderPage name="Settings" />} 
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
