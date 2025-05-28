import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { ColorExtractor } from './components/colors/ColorExtractor';
import { ChatInterface } from './components/chat/ChatInterface';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { CodeGenerator } from './components/code/CodeGenerator';
import { LoginForm } from './components/auth/LoginForm';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorExtractor />
                    <ChatInterface />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/code"
              element={
                <ProtectedRoute>
                  <CodeGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatInterface />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};
