


import './styles/App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					{/* Add other routes here */}
					<Route path="/" element={null} />
				</Routes>
				<Footer />
			</Router>
		</AuthProvider>
	);
}

export default App;
