import ScrollMeasurements from '../../components/motion/ScrollMeasurements';
import type { Metadata } from 'next';
import Navbar from '../../components/navigation/Navbar';
import SelectedProjects from '../../components/projects/SelectedProjects';

export const metadata: Metadata = { title: 'Projects | Debdutta Ghosh' };

export default function ProjectsPage() {
  return (
    <div className="page-frame">
      <Navbar active="Projects" />
      <main><SelectedProjects /><ScrollMeasurements /></main>
    </div>
  );
}
