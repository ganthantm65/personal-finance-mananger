import React from 'react';

function AccountCard({ account, onUpdateClick }) {
  return (
    <div className="relative w-[320px] h-[250px] bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-violet-700 to-pink-500"></div>

      <div className="flex flex-col justify-between h-full p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{account.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{account.type} account</p>
        </div>

        <div className="flex flex-col mt-2">
          <p className="text-sm text-gray-500">Account No:</p>
          <p className="text-md font-medium text-gray-700 tracking-wide">{account.accNo}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Balance</p>
            <h3 className="text-2xl font-bold text-violet-700">
              ₹{account.balance.toLocaleString()}
            </h3>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{account.currency}</div>
        </div>

        <button
          onClick={() => onUpdateClick(account)}
          className="w-[280px] h-10 mt-2 p-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 text-white cursor-pointer"
        >
          Update Account
        </button>
      </div>
    </div>
  );
}

export default AccountCard;
