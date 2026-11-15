import ScrollMeasurements from '../../components/motion/ScrollMeasurements';
import type { Metadata } from 'next';
import AboutJournal from '../../components/about/AboutJournal';
import Navbar from '../../components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'About | Debdutta Ghosh',
  description: 'Field notes on what Debdutta Ghosh builds, what she is learning, and what draws her to creative technology.',
};

export default function AboutPage() {
  return (
    <div className="page-frame">
      <Navbar active="About" />
      <main><AboutJournal /><ScrollMeasurements /></main>
    </div>
  );
}
