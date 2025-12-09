import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import { TrendingUp, TrendingDown, ArrowLeftRight, Calendar, PieChart, DollarSign, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user_data"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Accounts
      const accountsUrl = `http://localhost:5000/api/user/${user.id}/accounts`;
      const accountsOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const accountsReq = await fetch(accountsUrl, accountsOptions);
      if (!accountsReq.ok) throw new Error('Failed to fetch accounts');
      const accountsData = await accountsReq.json();
      const accountList = accountsData.accounts || accountsData;
      setAccounts(accountList);

      // Fetch Transactions for first account
      if (accountList.length > 0) {
        const firstAccountId = accountList[0]._id;
        const transactionsUrl = `http://localhost:5000/api/transactions/${firstAccountId}`;
        const transactionsOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        const transactionsReq = await fetch(transactionsUrl, transactionsOptions);
        if (transactionsReq.ok) {
          const transactionsData = await transactionsReq.json();
          setTransactions(transactionsData || []);
        }
      }

      // Fetch Budgets
      const budgetsUrl = `http://localhost:5000/api/budgets/user/${user.id}`;
      const budgetsOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const budgetsReq = await fetch(budgetsUrl, budgetsOptions);
      if (budgetsReq.ok) {
        const budgetsData = await budgetsReq.json();
        const budgetList = budgetsData.budgets || [];
        
        // Calculate spent amount for each budget
        const budgetsWithSpent = budgetList.map(budget => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
          return { ...budget, spent };
        });
        
        setBudgets(budgetsWithSpent);
      }

      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalBalance, income, expenses };
  };

  const { totalBalance, income, expenses } = calculateTotals();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-gray-50">
        <SideBar />
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-900 text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-gray-50 text-gray-800">
      <SideBar />
      <div className="w-full h-full flex flex-col justify-start items-center overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your finances at a glance</p>
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full h-full overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                  <div className="bg-green-100 rounded-full p-2">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold text-gray-900">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-violet-700" />
                  <div className="bg-violet-100 rounded-full p-2">
                    <TrendingUp className="w-6 h-6 text-violet-700" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Income</p>
                <h2 className="text-4xl font-bold text-gray-900">₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="w-10 h-10 text-red-600" />
                  <div className="bg-red-100 rounded-full p-2">
                    <ArrowLeftRight className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
                <h2 className="text-4xl font-bold text-gray-900">₹{expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Accounts Section - 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-6 h-6" />
                    Your Accounts
                  </h3>
                </div>
                <div className="space-y-4">
                  {accounts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No accounts found</p>
                  ) : (
                    accounts.map(account => (
                      <div key={account._id} className="bg-gradient-to-r from-violet-700 to-violet-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-full p-3">
                              <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold text-lg">{account.name}</h4>
                              <p className="text-violet-100 text-sm capitalize">{account.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Budget Overview - 1 column */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-6 h-6" />
                    Budgets
                  </h3>
                </div>
                <div className="space-y-4">
                  {budgets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No budgets found</p>
                  ) : (
                    budgets.map(budget => {
                      const percentage = (budget.spent / budget.amount) * 100;
                      const isOverBudget = percentage > 100;
                      return (
                        <div key={budget._id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-medium">{budget.category}</span>
                            <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                              ₹{budget.spent.toFixed(2)} / ₹{budget.amount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                isOverBudget ? 'bg-red-500' : 'bg-violet-700'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">{percentage.toFixed(1)}% used</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Recent Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions found</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Type</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 10).map(transaction => (
                        <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 text-gray-900 font-medium">{transaction.category}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.type === 'income' ? 'bg-green-100 text-green-700' :
                              transaction.type === 'expense' ? 'bg-red-100 text-red-700' :
                              'bg-violet-100 text-violet-700'
                            }`}>
                              {transaction.type === 'income' ? <TrendingUp className="w-3 h-3" /> :
                               transaction.type === 'expense' ? <TrendingDown className="w-3 h-3" /> :
                               <ArrowLeftRight className="w-3 h-3" />}
                              {transaction.type}
                            </span>
                          </td>
                          <td className={`py-4 px-4 text-right font-bold ${
                            transaction.type === 'income' ? 'text-green-600' :
                            transaction.type === 'expense' ? 'text-red-600' :
                            'text-violet-700'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;