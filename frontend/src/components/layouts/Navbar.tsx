import {Cloud} from 'lucide-react';

import {useNavigate} from 'react-router-dom'; // <-- you need this

import {Button} from '@components/ui/button';

import {useAuth} from '@hooks/useAuth';

import {ROUTES} from '@config/constants';

const Navbar = () => {
  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold text-blue-600">WeatherApp</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleLogout} className="cursor-pointer">
            Cerrar sesión
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
