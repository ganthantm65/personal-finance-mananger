import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { Plus } from 'lucide-react';
import AccountCard from '../components/AccountCard';
import AccountForm from '../components/AccountForm';
import AccountUpdate from '../components/AccountUpdate';
import toast from 'react-hot-toast';

function Account() {
  const [accounts, setAccounts] = useState([]);
  const [isAccountVisible, setAccountVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const user = JSON.parse(localStorage.getItem("user_data"));
  const total=accounts.reduce((sum,acc)=>sum+Number(acc.balance),0)

  const fetchAccounts = async () => {
    try {
      const url = `http://localhost:5000/api/user/${user.id}/accounts`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      };
      const req = await fetch(url, options);
      if (!req.ok) throw new Error(req.statusText);

      const data = await req.json();
      const accountList = data.accounts || data;
      setAccounts(accountList);
      localStorage.setItem("accounts", JSON.stringify(accountList));
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [accounts]);

  const handleAccountUpdate = (updatedList) => {
    setAccounts(updatedList);
    localStorage.setItem("accounts", JSON.stringify(updatedList));
    toast.success("Account updated successfully");
  };

  return (
    <div className="w-screen h-screen flex flex-row  bg-gray-50 text-gray-800">
      {isAccountVisible && (
        <AccountForm
          isAccountVisible={isAccountVisible}
          setAccoutVisible={setAccountVisible}
          addAccountToList={(newAccount) => {
            setAccounts(prev => [...prev, newAccount]);
            localStorage.setItem("accounts", JSON.stringify([...accounts, newAccount]));
            toast.success("Account added successfully");
          }}
        />
      )}

      {selectedAccount && (
        <AccountUpdate
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onUpdateSuccess={handleAccountUpdate}
        />
      )}

      <SideBar />

      <div className="w-full h-full flex flex-col justify-start items-center overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center p-6 shadow-sm bg-white sticky top-0 z-10">
          <h1 className="text-4xl font-bold text-gray-800">My Accounts</h1>
          <button
            onClick={() => setAccountVisible(!isAccountVisible)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 active:scale-95 transition-all duration-200 text-white shadow-md"
          >
            <span className="font-medium">Create Account</span>
            <Plus size={22} />
          </button>
        </div>

        <div className="w-11/12 md:w-4/5 lg:w-[96%] mt-8 flex flex-col justify-center items-start pl-10 bg-gradient-to-r from-violet-700 to-violet-500 rounded-md shadow-xl py-6">
          <h1 className="text-sm text-gray-200 mb-1 tracking-wide uppercase">Total Balance</h1>
          <h1 className="text-5xl text-white font-bold mb-1">₹ {total}</h1>
          <h1 className="text-xl text-white font-semibold opacity-90">{accounts.length} Accounts</h1>
        </div>

        <div className="w-full h-full flex flex-wrap justify-start items-start gap-4 mt-8 ml-5 overflow-y-auto p-4">
          {accounts.length > 0 ? (
            accounts.map((acc) => (
              <AccountCard
                key={acc._id}
                account={acc}
                onUpdateClick={setSelectedAccount}
              />
            ))
          ) : (
            <p className="text-gray-500 text-lg">No Account Added</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
