  // src/App.tsx
  import React from 'react';
  import UploadResume from './components/UploadResume';
  import Header from './components/Header';
  import Footer from './components/Footer';
  import Navbar from './components/Navbar';
  import './App.css';
  
  const App: React.FC = () => {
    return (
      <div className="app">
        <Header />
        <Navbar />
        <main className="main-content">
          <UploadResume />
        </main>
        <Footer />
      </div>
    );
  };
  
  export default App;