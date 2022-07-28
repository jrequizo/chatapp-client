import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { QueryClient, QueryClientProvider } from "react-query";

import { API } from '@/utils/trpc/trpc';

// import { API } from "./utils/trpc/trpc";

import LoginPage from './pages/login/LoginPage';
import Register from './pages/register/RegisterPage';
import ChatPage from './pages/chat/ChatPage';
import ProfilePage from './pages/profile/ProfilePage';

import NoPage from './pages/nopage/NoPage'
import UnderConstruction from './pages/under-construction/UnderConstruction'

import './App.css';
import { getJwt } from './utils/credentialManager';

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ChatPage />} />
        <Route path="/">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          <Route path="profile">
            <Route path=":id" element={<ProfilePage />}/>
          </Route>
          <Route path="under-construction" element={<UnderConstruction />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/trpc' : `${process.env.PUBLIC_URL}/api/trpc`

function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    API.createClient({
      url: url,
      headers() {
        return {
          authorization: `Bearer ${getJwt()}`
        }
      },
    })
  )

  return (
    <API.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </API.Provider>
  )
}

export default App;
