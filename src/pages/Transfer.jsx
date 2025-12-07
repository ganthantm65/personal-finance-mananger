import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import toast from "react-hot-toast";

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();

    const { fromAccountId, toAccountId, amount, date } = transferData;

    if (!fromAccountId || !toAccountId || !amount || !date) {
      toast.error("All fields are required");
      return;
    }

    if (fromAccountId === toAccountId) {
      toast.error("From and To account cannot be the same");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...transferData, type: "transfer" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Transfer failed");

      setTransfers((prev) => [data, ...prev]);
      toast.success("💸 Transfer successful");

      setTransferData({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        category: "",
        date: "",
      });
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row bg-gray-50 text-gray-800">
      <SideBar />
      <div className="w-full h-full flex flex-col justify-start items-center overflow-auto">
        <div className="w-full flex flex-row justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">Transfers</h1>
        </div>
        <div className="w-11/12 md:w-4/5 lg:w-[96%] bg-white rounded-lg shadow-md py-6 px-8 mt-8">
          <h2 className="text-2xl font-semibold mb-5 text-violet-700">💳 Create Transfer</h2>
          <form
            className="flex flex-col gap-4 items-center"
            onSubmit={handleTransfer}
          >
            <select
              value={transferData.fromAccountId}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, fromAccountId: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            >
              <option value="">From Account</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>

            <select
              value={transferData.toAccountId}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, toAccountId: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            >
              <option value="">To Account</option>
              {accounts
                .filter((acc) => acc._id !== transferData.fromAccountId)
                .map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name} ({acc.type})
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={transferData.amount}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            />

            <input
              type="text"
              placeholder="Category"
              value={transferData.category}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            />

            <input
              type="date"
              value={transferData.date}
              onChange={(e) =>
                setTransferData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`h-12 px-6 w-full font-semibold rounded-lg transition ${
                loading
                  ? "bg-violet-400 text-white cursor-not-allowed"
                  : "bg-violet-700 text-white hover:bg-violet-800"
              }`}
            >
              {loading ? "Processing..." : "Transfer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
