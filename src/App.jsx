import React from 'react'
import Navigation from './routes/Navigation';
import { Toaster } from "@/components/ui/sonner";


function App() {
  return (
    <div className="w-full h-screen">
      <Navigation />

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App