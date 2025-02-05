import './App.css';
import PrimarySearchAppBar from './components/Nav/PrimaryAppBar';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './ErrorHandeling/ErrorBoundry.jsx';
import { ThemeProviderComponent } from './context/ThemeContext.jsx';

export default function App() {

  return (
    <>
      <ErrorBoundary>
        <ThemeProviderComponent>
          <PrimarySearchAppBar />
          <div className='hero-cont'>
            <Outlet />
          </div>
          <Footer />
        </ThemeProviderComponent>
      </ErrorBoundary>
    </>
  );
};
