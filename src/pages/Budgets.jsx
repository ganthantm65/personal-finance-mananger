import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import toast from "react-hot-toast";

function Budgets() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const year = new Date().getFullYear();

  const [budgets, setBudgets] = useState([]);
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user_data"));
  
  const fetchBudgets = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/budgets/user/${user.id}`);
      const data = await res.json();
      
      setBudgets(data.budgets || []);
      
    } catch(error) {
      toast.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async () => {
    const budget = { category, amount, month, year, user: user.id };

    try {
      const res = await fetch(`http://localhost:5000/api/budgets/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });

      if (!res.ok) throw new Error();

      toast.success("Budget added successfully");

      setCategory("");
      setAmount("");
      setMonth("");

      fetchBudgets();
    } catch {
      toast.error("Failed to add budget");
    }
  };

  const updateBudget = async () => {
    const budget = { category, amount, month, year };

    try {
      const res = await fetch(`http://localhost:5000/api/budgets/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });

      if (!res.ok) throw new Error();

      toast.success("Budget updated successfully");

      setCategory("");
      setAmount("");
      setMonth("");
      setEditId(null);
      fetchBudgets();
    } catch {
      toast.error("Failed to update budget");
    }
  };

  const startEdit = (b) => {
    setCategory(b.category);
    setAmount(b.amount);
    setMonth(b.month);
    setEditId(b._id);
  };

  return (
    <div className="w-screen h-screen flex flex-row bg-gray-50 text-gray-800">
      <SideBar />

      <div className="w-full h-full flex flex-col justify-start items-center overflow-auto">
        <div className="w-full flex flex-row justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">Budgets</h1>
        </div>

        <div className="w-[70%] bg-white flex flex-col gap-4 rounded-lg shadow-md py-6 px-8 mt-8 mb-10">
          <h1 className="text-2xl font-bold text-violet-700">
            {editId ? "Update Budget" : "Add Budget"}
          </h1>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            placeholder="Enter Category"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            placeholder="Enter Amount"
          />

          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none"
            placeholder="Enter Month"
          />

          {editId ? (
            <button
              className="w-full h-10 rounded-md bg-green-600 text-white"
              onClick={updateBudget}
            >
              Update Budget
            </button>
          ) : (
            <button
              className="w-full h-10 rounded-md bg-violet-700 text-white"
              onClick={addBudget}
            >
              Add Budget
            </button>
          )}
        </div>

        <div className="w-[90%] bg-white rounded-xl shadow-lg p-6 mb-10">
          <h1 className="text-2xl font-bold text-violet-700 mb-4">All Budgets</h1>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-violet-700 text-white">
                  <th className="p-4 font-semibold text-left">Category</th>
                  <th className="p-4 font-semibold text-left">Amount</th>
                  <th className="p-4 font-semibold text-left">Month</th>
                  <th className="p-4 font-semibold text-left">Year</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {budgets.map((b, index) => (
                  <tr
                    key={b._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-violet-100 transition-all`}
                  >
                    <td className="p-4 border-b border-gray-200">{b.category}</td>
                    <td className="p-4 border-b border-gray-200">{b.amount}</td>
                    <td className="p-4 border-b border-gray-200">{b.month}</td>
                    <td className="p-4 border-b border-gray-200">{b.year}</td>

                    <td className="p-4 border-b border-gray-200 text-center">
                      <button
                        onClick={() => startEdit(b)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {budgets.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-6 text-gray-500 italic"
                    >
                      No budgets added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;
