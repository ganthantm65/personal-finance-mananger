import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import TransactionForm from "../components/TransactionForm";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("user_data"));

  const fetchTransactions = async (accountId) => {
    if (!accountId) return;
    try {
      const url = `http://localhost:5000/api/transactions/${accountId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");
      setTransactions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    }
  };

  const fetchAccounts = async () => {
    try {
      const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
      setAccounts(storedAccounts);
      if (storedAccounts.length > 0) {
        setSelectedAccount(storedAccounts[0]._id);
        fetchTransactions(storedAccounts[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchTransactions(selectedAccount);
  }, [selectedAccount]);

  return (
    <div className="w-screen h-screen flex flex-row  bg-gray-50 text-gray-800">
      <SideBar />
      <div className="w-full h-full flex flex-col justify-start items-center overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">Transactions</h1>
          <button
            onClick={() => setFormVisible(!isFormVisible)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 active:scale-95 transition-all duration-200 text-white shadow-md"
          >
            <span className="font-medium">Add Transaction</span>
            <Plus size={22} />
          </button>
        </div>

        <div className="w-11/12 md:w-4/5 lg:w-[96%] mt-8 bg-gradient-to-r from-violet-700 to-violet-500 rounded-md shadow-xl py-6 px-8 text-white">
          <h1 className="text-sm text-gray-200 mb-1 tracking-wide uppercase">
            Total Transactions
          </h1>
          <h1 className="text-5xl font-bold mb-1">{transactions.length}</h1>
          <h1 className="text-xl font-semibold opacity-90">
            {accounts.length} Linked Accounts
          </h1>
        </div>

        <div className="w-11/12 md:w-4/5 lg:w-[96%] mt-6 bg-white rounded-md shadow-md p-4 flex items-center gap-4">
          <label className="font-semibold text-gray-700">Select Account:</label>
          <select
            value={selectedAccount || ""}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>

        <div className="w-11/12 md:w-4/5 lg:w-[96%] mt-8 mb-10 bg-white rounded-lg shadow-md overflow-hidden">
          {transactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-violet-700 text-white">
                <tr>
                  <th className="p-3 text-sm font-semibold">Type</th>
                  <th className="p-3 text-sm font-semibold">Amount</th>
                  <th className="p-3 text-sm font-semibold">Category</th>
                  <th className="p-3 text-sm font-semibold">Account</th>
                  <th className="p-3 text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-700"
                            : tx.type === "expense"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-700">
                      ₹{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-600">{tx.category}</td>
                    <td className="p-3 text-gray-600">{tx.account}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-lg text-center py-10">
              No Transactions Found
            </p>
          )}
        </div>
      </div>

      {isFormVisible && (
        <TransactionForm
          accounts={accounts}
          setFormVisible={setFormVisible}
          setTransactions={setTransactions}
          selectedAccount={selectedAccount}
        />
      )}
    </div>
  );
}

export default Transactions;
