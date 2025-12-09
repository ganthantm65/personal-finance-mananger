import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Transactions from './pages/Transactions'
import Transfer from './pages/Transfer'
import Budgets from './pages/Budgets'
import SignUp from './pages/SignUp'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/transactions' element={<Transactions/>}/>
        <Route path='/transfer-amount' element={<Transfer/>}/>
        <Route path='/budgets' element={<Budgets/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
