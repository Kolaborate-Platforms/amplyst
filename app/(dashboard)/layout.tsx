import Header from '@/app/_components/navigation/header';
import SideNav from '@/app/_components/navigation/side.nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="w-64 h-screen px-2 shadow-md border-r border-primary">
        <SideNav />
      </div>
      <div className="w-[calc(100%-256px)] h-screen">
        <div className="h-20 shadow-md drop-shadow-md px-6">
          <Header />
        </div>
        <div className="h-[calc(100vh-80px)] p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
