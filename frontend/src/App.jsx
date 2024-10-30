import { Routes,Route } from "react-router-dom"
import SignupPage from "./pages/auth/signup/SignupPage"


function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
			<Routes>
				{/* <Route path='/' element={<HomePage />} /> */}
				<Route path='/signup' element={<SignupPage />} />
				{/* <Route path='/login' element={<LoginPage />} /> */}
			</Routes>
		</div>
  )
}

export default App
