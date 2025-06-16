import './App.css'
import { Join } from './components/Join'
import { Join2 } from './components/Join2'
import { Message } from './components/Message'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
   
    <div className='bg-cyan-700 min-h-screen flex justify-center items-center'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Join/>}/>
        <Route path='/room' element={<Message/>}/>
      </Routes>
    </BrowserRouter>
      
    </div>
      
      
    </>
  )
}

export default App
