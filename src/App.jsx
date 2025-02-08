import Navbar from './components/header/navbar';
import SiteToSite from './components/operations/configuration/vpn/site-to-site.jsx/s2s-vpn';

function App() {
  return (
    <div className="bg-sky-100 min-h-screen">
      <Navbar />;
      <SiteToSite />
    </div>
  );
}

export default App;
