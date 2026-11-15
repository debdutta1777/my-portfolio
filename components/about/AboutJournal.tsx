import { ArrowDown } from 'lucide-react';
import JournalMotion from './JournalMotion';
import JournalNotes from './JournalNotes';
import styles from './journal.module.css';

const identity = [
  {
    title: 'Who I am',
    text: 'I’m a student developer drawn to projects that make a technical idea easier for someone else to understand or use.',
  },
  {
    title: 'What I love building',
    text: 'I enjoy building AI-powered tools and web experiences where the interaction is as considered as the idea behind it.',
  },
  {
    title: 'What drives me',
    text: 'I’m happiest with a question I can try out. A rough prototype gives me something concrete to test, rethink, and make clearer.',
  },
  {
    title: 'What I’m exploring',
    text: 'I’m interested in how AI makes mistakes, how software makes those mistakes visible, and what better interaction design can do about it.',
  },
];

const toolkit = [
  {
    id: 'ai',
    title: 'AI / ML',
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Model evaluation'],
    text: 'For experimenting with models, comparing results, and studying where predictions or language-model outputs go wrong.',
  },
  {
    id: 'web',
    title: 'Web development',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    text: 'For giving an idea a place to live on the web, from a first working interface to the details that make it feel easy to use.',
  },
  {
    id: 'design',
    title: 'Design / creative tech',
    tools: ['GSAP', 'Motion design', 'Interaction design', 'Visual storytelling'],
    text: 'For shaping how an idea is discovered. I like using movement to show a connection or guide attention.',
  },
  {
    id: 'tools',
    title: 'Tools I use',
    tools: ['Git', 'GitHub', 'Figma', 'VS Code'],
    text: 'For sketching, iterating, tracking decisions, and getting work into a shape I can share.',
  },
];

const portrait = (
  <div className={`${styles.journalPhoto} ${styles.portraitPhoto}`}>
    <img src="/images/debdutta-portrait-rustic.png" alt="Portrait of Debdutta Ghosh" width="1086" height="1448" loading="lazy" />
    <span>collecting questions, not just answers</span>
  </div>
);

const desk = (
  <figure className={`${styles.journalPhoto} ${styles.storyPhoto}`}>
    <img src="/images/about/creative-desk.svg" alt="Illustration of a sunlit sketchbook, pencil, and small leaves on a desk" width="560" height="430" loading="lazy" />
  </figure>
);

const beyondNotes = [
  { title: 'Storytelling & interfaces', text: '“I like thinking about what a person notices first, and what makes them want to keep exploring.”' },
  { title: 'A detail I always notice', text: '“A little warmth or playfulness can change how it feels to use something.”' },
  { title: 'A question in the margins', text: '“What would make this easier to understand without losing what makes it interesting?”' },
];

const leftPages = [
  <div className={styles.scrapbook} key="identity-art">
    <span className={styles.bookFolio}>01 / A little introduction</span>
    {portrait}
    <svg className={styles.magnifier} viewBox="0 0 70 100" aria-hidden="true">
      <circle cx="28" cy="28" r="19" /><circle cx="28" cy="28" r="15" className={styles.lensInner} />
      <path d="M42 43 60 76" /><path d="M23 16q7-4 13 1" className={styles.lensGlint} />
    </svg>
    <p className={styles.paperAside}>Ideas usually begin with a question.</p>
  </div>,
  <div className={styles.scrapbook} key="toolkit-art">
    <span className={styles.bookFolio}>02 / Tools &amp; Tech</span>
    <div className={`${styles.journalPhoto} ${styles.diagramPhoto}`}>
      <span className={styles.diagramLabel}>a sketch before the build</span>
      <svg viewBox="0 0 280 180" aria-hidden="true">
        <path d="M33 98C67 44 111 66 137 91S214 135 251 63M44 113l61 27 49-72 74 18" />
        <circle cx="35" cy="98" r="12" /><circle cx="137" cy="91" r="15" /><circle cx="251" cy="63" r="12" />
        <circle cx="105" cy="140" r="8" /><circle cx="228" cy="86" r="9" />
      </svg>
      <span className={styles.diagramCaption}>question → prototype → rethink</span>
    </div>
    <div className={styles.indexSlip}><span>working note / 02</span><br />Make the complicated feel a little clearer.</div>
  </div>,
  <div className={styles.scrapbook} key="beyond-art">
    <span className={styles.bookFolio}>03 / Outside the screen</span>
    {desk}
    <div className={styles.indexSlip}><span>note to self / 03</span><br />Leave room for the unexpected.</div>
  </div>,
];

export default function AboutJournal({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? 'h2' : 'h1';
  const Subheading = embedded ? 'h3' : 'h2';
  return (
    <section id="about" aria-labelledby="about-heading" className={`${styles.page} ${embedded ? styles.embedded : ''}`}>
      <JournalMotion leftPages={leftPages} intro={
        <section className={styles.cover} data-journal-sheet>
          <div className={styles.coverCopy} data-journal-intro-copy>
            <Heading className={styles.coverHeading} id="about-heading"><span className={styles.headingMask}><span data-journal-ink>A little more<br />about <em>me.</em></span></span></Heading>
            <p data-journal-copy>
              I’m Debdutta, a student developer who enjoys blending <a href="#toolkit">technology</a>,
              {' '}<a href="#beyond-code">creativity</a>, and <a href="#identity">curiosity</a> into meaningful digital experiences.
              I’m especially drawn to AI, thoughtful interfaces, and ideas that feel both useful and human.
            </p>
            <a href="#identity" className={styles.coverLink} data-journal-copy data-journal-open>
              Open the notebook <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.noteFrame} data-journal-note-frame>
            <figure className={styles.coverNote} data-journal-note>
              <figcaption className={styles.noteLabel}>A question I keep coming back to</figcaption>
              <blockquote>How can I make a complex idea easier to explore?</blockquote>
              <div className={styles.noteSign} aria-hidden="true">— DG.</div>
              <span className={styles.noteTape} data-journal-tape aria-hidden="true" />
            </figure>
          </div>
        </section>
      }>
        <section id="identity" className={styles.chapter} aria-labelledby="identity-heading">
          <header className={styles.chapterHeader}>
            <span className={styles.eyebrow}>On the personal side</span>
            <Subheading className={styles.chapterTitle} id="identity-heading" tabIndex={-1}><span className={styles.headingMask}><span data-journal-ink>A few things about me.</span></span></Subheading>
          </header>
          <JournalNotes kind="identity" notes={identity.map(({ title, text }) => ({ title, content: <p>{text}</p> }))} />
          <div className={styles.mobileArt}>{portrait}</div>
        </section>

        <section id="toolkit" className={styles.chapter} aria-labelledby="toolkit-heading">
          <header className={styles.chapterHeader}>
            <span className={styles.eyebrow}>Tools &amp; Tech</span>
            <Subheading className={styles.chapterTitle} id="toolkit-heading" tabIndex={-1}><span className={styles.headingMask}><span data-journal-ink>My toolkit.</span></span></Subheading>
            <p>What I reach for when a sketch starts becoming something I can test.</p>
          </header>
          <JournalNotes kind="toolkit" notes={toolkit.map(({ title, tools, text }) => ({
            title,
            content: (
              <div className={styles.toolBody}>
                <ul aria-label={`${title} tools`}>
                  {tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
                <p>{text}</p>
              </div>
            ),
          }))} />
        </section>

        <section id="beyond-code" className={styles.beyond} aria-labelledby="beyond-heading">
          <header className={styles.chapterHeader}>
            <span className={styles.eyebrow}>Outside the screen</span>
            <Subheading className={styles.chapterTitle} id="beyond-heading" tabIndex={-1}><span className={styles.headingMask}><span data-journal-ink>Beyond code.</span></span></Subheading>
          </header>
          <JournalNotes kind="beyond" notes={beyondNotes.map(({ title, text }) => ({ title, content: <blockquote>{text}</blockquote> }))} />
          <div className={styles.mobileArt}>{desk}</div>
        </section>
      </JournalMotion>
    </section>
  );
}
