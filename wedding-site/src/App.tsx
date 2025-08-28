import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ManageLayout from './pages/manage/ManageLayout';
import ManagePage from './pages/manage/ManagePage';

import './App.css';
import GuestReplyPage from './pages/GuestReplyPage';
import GuestsPage from './pages/manage/GuestsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/wedding/guest-invite/:inviteId" element={<GuestReplyPage />} />

        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <ManageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagePage />} /> 
          <Route path="invites" element={<ManagePage />} />
          <Route path="guests" element={<GuestsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;