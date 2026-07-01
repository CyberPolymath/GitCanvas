import { useNavigate } from 'react-router-dom';
import ContributionGrid from '../components/ContributionGrid';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TemplateList from '../components/TemplateList';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/Designer.module.css';

export default function Designer() {
	const navigate = useNavigate();

	return (
		<main className="page page--designer">
			<Header onSettings={() => navigate('/settings')} />
			<div className="designer-layout">
				<Sidebar />
				<section className="designer-main">
					<h1>Designer</h1>
					<SuccessMessage text="Plan added successfully." />
					<ContributionGrid />
					<TemplateList tier="free" />
				</section>
			</div>
		</main>
	);
}
