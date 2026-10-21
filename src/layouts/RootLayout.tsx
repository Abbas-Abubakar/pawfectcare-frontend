import { ColdStartNotice } from '@/components/ColdStartNotice';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return <>
    <Outlet />;
    <ColdStartNotice />
  </>
};