import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user_data'));
  
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const fetchAccounts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}/accounts`);
      const data = await res.json();
      setAccounts(data.accounts || data);
    } catch {
      toast.error('Failed to fetch accounts');
    }
  };
  
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${user.id}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {
      toast.error('Failed to fetch transactions');
    }
  };
  
  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);
  
  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#4ade80', '#f87171'],
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: 'top' }, 
      title: { display: false } 
    },
  };
  
  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row bg-gray-50 text-gray-800">
      <SideBar />
      <div className="w-full h-full flex flex-col justify-start items-center overflow-auto">
        <div className="w-full flex flex-row justify-between items-center p-4 md:p-6 shadow-sm bg-white sticky top-0 z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Dashboard</h1>
        </div>
        
        <div className="w-full px-4 md:px-6 lg:px-8 mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-l-4 border-violet-700 hover:shadow-xl transition-shadow">
            <h3 className="text-sm md:text-lg text-gray-600">Total Accounts</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">{accounts.length}</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-l-4 border-emerald-600 hover:shadow-xl transition-shadow">
            <h3 className="text-sm md:text-lg text-gray-600">Total Balance</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">₹ {totalBalance.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <h3 className="text-sm md:text-lg text-gray-600">Total Income</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">₹ {totalIncome.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-l-4 border-red-600 hover:shadow-xl transition-shadow">
            <h3 className="text-sm md:text-lg text-gray-600">Total Expense</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">₹ {totalExpense.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="w-full px-4 md:px-6 lg:px-8 mt-6 md:mt-10 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-violet-700 mb-4">Income vs Expense</h2>
            <div className="h-64 md:h-80 lg:h-96">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;