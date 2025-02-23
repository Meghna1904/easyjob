
import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadResume from './components/UploadResume';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 py-8">
        <UploadResume />
      </main>
      <Footer />
    </div>
  );
};

export default App;
