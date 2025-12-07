import React, { useState } from "react";
import toast from "react-hot-toast";

function TransactionForm({ accounts, setFormVisible, setTransactions }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    fromAccountId: "",
    toAccountId: "",
  });

  const handleCreateTransaction = async () => {
    try {
      const url = "http://localhost:5000/api/transactions";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      };

      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create transaction");

      toast.success("Transaction added successfully");
      setTransactions((prev) => [data, ...prev]);
      setFormVisible(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-40'>
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Add Transaction
        </h2>

        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border rounded-lg p-2 outline-none"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>

        {(formData.type === "expense" || formData.type === "transfer") && (
          <select
            value={formData.fromAccountId}
            onChange={(e) =>
              setFormData({ ...formData, fromAccountId: e.target.value })
            }
            className="border rounded-lg p-2 outline-none"
          >
            <option value="">From Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>
        )}

        {(formData.type === "income" || formData.type === "transfer") && (
          <select
            value={formData.toAccountId}
            onChange={(e) =>
              setFormData({ ...formData, toAccountId: e.target.value })
            }
            className="border rounded-lg p-2 outline-none"
          >
            <option value="">To Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
          className="border rounded-lg p-2 outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border rounded-lg p-2 outline-none"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border rounded-lg p-2 outline-none"
        />

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setFormVisible(false)}
            className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTransaction}
            className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionForm;
