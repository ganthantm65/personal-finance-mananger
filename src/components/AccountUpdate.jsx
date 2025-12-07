import { X } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function AccountUpdate({ account, onClose, onUpdateSuccess }) {
  const [name, setName] = useState(account.name);
  const [type, setType] = useState(account.type);
  const [accNo, setAccNo] = useState(account.accNo);
  const [ifsc, setIfsc] = useState(account.ifsc);
  const [pin, setPin] = useState(account.PIN);
  const [balance, setBalance] = useState(account.balance);
  const [currency, setCurrency] = useState(account.currency);

  const validateAndSubmit = async () => {
    if (!name || !type || !accNo || !ifsc || !pin || !balance || !currency) {
      return toast.error("All fields are required");
    }
    if (!/^\d{4}$/.test(pin)) return toast.error("PIN must be 4 digits");
    if (isNaN(balance)) return toast.error("Balance must be a number");

    const accountData = { name, type, accNo, ifsc, PIN: pin, amount: Number(balance), currency };

    try {
      const url = `http://localhost:5000/api/user/accounts/${account._id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(accountData),
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to update account");

      const data = await response.json();
      toast.success("Account updated successfully");

      const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
      const updatedAccounts = storedAccounts.map((a) =>
        a._id === data.account._id ? { ...a, ...data.account } : a
      );
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));

      onUpdateSuccess(updatedAccounts);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-40">
      <div className="w-120 h-130 p-3 z-50 flex flex-col gap-2 justify-evenly items-center bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg bg-transparent outline-none border-none text-violet-700 cursor-pointer"
        >
          <X size={25} />
        </button>
        <h1 className="text-2xl font-poppins font-bold">Update Account</h1>

        <input type="text" placeholder="Account Name" value={name} onChange={e => setName(e.target.value)} className="w-100 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />

        <div className="flex flex-row gap-2 justify-center items-center">
          <select value={type} onChange={e => setType(e.target.value)} className="w-49 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none">
            <option value="">Account Type</option>
            <option value="savings">Savings</option>
            <option value="current">Current</option>
            <option value="credit">Credit</option>
          </select>
          <input type="text" placeholder="Currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-49 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />
        </div>

        <input type="text" placeholder="Account Number" value={accNo} onChange={e => setAccNo(e.target.value)} className="w-100 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />
        <input type="text" placeholder="IFSC Code" value={ifsc} onChange={e => setIfsc(e.target.value)} className="w-100 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />
        <input type="text" placeholder="4-digit PIN" value={pin} onChange={e => setPin(e.target.value)} className="w-100 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />
        <input type="text" placeholder="Balance" value={balance} onChange={e => setBalance(e.target.value)} className="w-100 h-10 rounded-sm bg-gray-50 px-2 border border-gray-300 focus:outline-none" />

        <button onClick={validateAndSubmit} className="w-100 h-10 p-3 rounded-sm bg-gradient-to-r from-violet-500 to-violet-700 text-white font-poppins">
          Update account
        </button>
      </div>
    </div>
  );
}

export default AccountUpdate;
