import { Outlet } from 'react-router-dom';
import SelectedDevice from './selectDevice';
export default function SecurityZonesLayout() {
  return (
    <div>
      <div className="sticky top-14 z-10 bg-white shadow">
        <SelectedDevice />
      </div>

      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
