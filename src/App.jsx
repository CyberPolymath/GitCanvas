import { Navigate, Route, Routes } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import Designer from './pages/Designer';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginSignup />} />
			<Route path="/designer" element={<Designer />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/home" element={<Navigate to="/designer" replace />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
