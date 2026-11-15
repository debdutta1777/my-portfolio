import { existsSync } from 'node:fs';
import { join } from 'node:path';
import AboutJournal from '../components/about/AboutJournal';
import SelectedProjects from '../components/projects/SelectedProjects';
import PortfolioHero from '../components/home/PortfolioHero';
import Journey from '../components/journey/Journey';
import ContactPanel from '../components/contact/ContactPanel';
import ScrollMeasurements from '../components/motion/ScrollMeasurements';
import Navbar from '../components/navigation/Navbar';

export default function HomePage() {
  const resume = existsSync(join(process.cwd(), 'public', 'resume.pdf')) ? '/resume.pdf' : null;

  return (
    <div className="page-frame portfolio-flow">
      <Navbar active="Home" continuous />
      <main>
        <PortfolioHero resume={resume} />
        <AboutJournal embedded />
        <SelectedProjects embedded />
        <Journey embedded />
        <ContactPanel embedded />
        <ScrollMeasurements />
      </main>
    </div>
  );
}
