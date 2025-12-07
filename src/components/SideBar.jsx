import React from 'react';
import {
  Wallet,
  LayoutDashboard,
  User,
  CreditCard,
  Send,
  PieChart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const navigate=useNavigate();
  return (
    <div className="h-screen w-64 bg-gray-950 text-white flex flex-col py-6 px-4 shadow-xl border-r border-violet-800/30">
      <div className="flex items-center justify-center mb-10">
        <Wallet className="text-violet-500 mr-2" size={32} />
        <h1 className="text-2xl font-bold font-poppins tracking-wide">
          My<span className="text-violet-400">Wallet</span>
        </h1>
      </div>
      <nav className="flex flex-col gap-3">
        <SidebarButton icon={<LayoutDashboard size={20} />} label="Dashboard" navigate={navigate} />
        <SidebarButton icon={<User size={20} />} label="Account" navigate={navigate}/>
        <SidebarButton icon={<CreditCard size={20} />} label="Transactions" navigate={navigate}/>
        <SidebarButton icon={<Send size={20} />} label="Transfer-Amount" navigate={navigate}/>
        <SidebarButton icon={<PieChart size={20} />} label="Budgets" navigate={navigate}/>
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>© 2025 MyWallet</p>
      </div>
    </div>
  );
}

const SidebarButton = ({ icon, label,navigate }) => (
  <button
    className="
      flex items-center gap-3 py-3 px-4 rounded-md text-gray-300 cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-violet-700 focus:bg-violet-700
    "
    onClick={()=>{navigate(`/${label.toLowerCase()}`)}}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);


export default SideBar;
