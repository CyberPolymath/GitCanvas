import { useNavigate } from 'react-router-dom';
import ContributionGrid from '../components/ContributionGrid';
import Header from '../components/Header';
import TemplateList from '../components/TemplateList';
import '../styles/Designer.css';

export default function Designer() {
	const navigate = useNavigate();

	return (
		<main className="page page--designer">
			<Header onSettings={() => navigate('/settings')} />
			<section className="designer-main">
				<div className="designer-header">
					<h1>Designer</h1>
					<p className="designer-main__description">
						Click any square to grow its green level, just like a GitHub contribution graph.
					</p>
				</div>
				<ContributionGrid />
				<TemplateList tier="free" />
				<div className="designer-footer">
					<button type="button" className="designer-footer__btn">View Templates</button>
					<button type="button" className="designer-footer__btn">Save Pattern</button>
				</div>
			</section>
		</main>
	);
}

