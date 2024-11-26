import React from 'react';
import { RouterProvider } from 'react-router-dom';
import route from './route';
import io from 'socket.io-client';
import { Toaster } from 'react-hot-toast';

export const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4001' :  import.meta.env.VITE_BACKEND;
export const socket = io.connect(BACKEND_URL);

const App = () => {
  return (
    <div className='bg-white text-black overflow-hidden'>

      <RouterProvider router={route()}></RouterProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </div>
  );
};

export default App;