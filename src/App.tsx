import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { useEffect } from 'react';
import { setLoggedInUser } from './app/slices/appSlice';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignupPage from './pages/SignupPage';
import PageNotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state:any)=> state.loggedInUser)

  useEffect(() => {
    const stringifiedUserObject = localStorage.getItem('user');
    if (stringifiedUserObject) {
      dispatch(setLoggedInUser(JSON.parse(stringifiedUserObject)));
    }
  }, [])



  const privateRoutes = () => {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    )
  }

  const publicRoutes = () => {
    return (
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/' element={<LoginPage />} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
    )
  }
  return (
    <BrowserRouter>
      {user ? privateRoutes() : publicRoutes()}
    </BrowserRouter>

  )
}

export default App
