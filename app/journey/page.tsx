import ScrollMeasurements from '../../components/motion/ScrollMeasurements';
import type { Metadata } from 'next';
import Journey from '../../components/journey/Journey';
import Navbar from '../../components/navigation/Navbar';

export const metadata: Metadata = { title: 'Journey | Debdutta Ghosh' };

export default function JourneyPage() {
  return <div className="page-frame"><Navbar active="Journey" /><main><Journey /><ScrollMeasurements /></main></div>;
}
