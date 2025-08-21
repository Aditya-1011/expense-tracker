// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { Indexauth } from './pages/auth/Indexauth'
import { Index } from './pages/dashboard/Index'
import { FinancialRecordProvider } from './context/financial-record-context'

function App() {
  // const [count, setCount] = useState(0)

  return ( 
    <>
    <Router>
      <div className=''>
        <Routes>
          {/* <Route path='/' element={<h1>Dashboard</h1>}></Route> */}
          <Route path='/auth' element={<Indexauth />}></Route>
          <Route path="/" element={<FinancialRecordProvider><Index /></FinancialRecordProvider>} />

        </Routes>
      </div>
    </Router>
      
    </>
  )
}

export default App
