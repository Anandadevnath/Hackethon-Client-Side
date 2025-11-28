import './styles/App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import FeaturesSection from './components/FeaturesSection';
import StatsSection from './components/StatsSection';
import CrisisSection from './components/CrisisSection';
import HowItWorks from './components/HowItWorks';
import CallToAction from './components/CallToAction';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/profile" element={<Profile />} />
					{/* Add other routes here */}
					<Route path="/" element={<>
							<HeroBanner />
							<FeaturesSection />
							<StatsSection />
							<CrisisSection />
							<HowItWorks />
							<CallToAction />
						</>} />
				</Routes>
				<Footer />
			</Router>
		</AuthProvider>
	);
}

export default App;
