import { notFound } from 'next/navigation';
import ContactPanel from '../../components/contact/ContactPanel';
import ScrollMeasurements from '../../components/motion/ScrollMeasurements';
import Navbar from '../../components/navigation/Navbar';
import { sections, type Section } from '../../components/navigation/sections';

export function generateStaticParams() {
  return Object.keys(sections).filter((section) => section !== 'about' && section !== 'projects' && section !== 'journey').map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section)) notFound();
  const title = sections[section as Section];

  return (
    <div className="page-frame">
      <Navbar active={title} />
      <main>
        <ContactPanel />
        <ScrollMeasurements />
      </main>
    </div>
  );
}
