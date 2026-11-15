import { Fragment } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';

const summary = 'Just someone who likes figuring things out and building things along the way :)';
const summaryWords = summary.split(' ');

export default function FinalIntroduction({ resume }: { resume: string | null }) {
  return (
    <article className="introduction" data-introduction aria-labelledby="intro-heading">
      <h1 id="intro-heading" tabIndex={-1}>
        <span className="heading-mask greeting"><span data-heading-line>Hi, I am</span></span>
        <span className="heading-mask name"><span data-heading-line>Debdutta Ghosh.</span></span>
      </h1>
      <svg className="name-stroke" data-name-stroke viewBox="0 0 220 16" fill="none" aria-hidden="true">
        <path d="M2 12C58-1 151-1 217 5M30 14c46-8 96-9 150-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <p className="summary">
        <span className="sr-only">{summary}</span>
        <span aria-hidden="true">
          {summaryWords.map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              {wordIndex > 0 && ' '}
              <span className="summary-word">
                {Array.from(word, (letter, letterIndex) => (
                  <span key={letterIndex} data-summary-letter>{letter}</span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      </p>
      <div className="actions flex flex-wrap justify-center">
        <a className="cta cta-primary" href="#projects" data-action>
          Explore My Work <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        {resume && <a className="cta cta-secondary" href={resume} download data-action>
          Download Resume <ArrowDownToLine size={16} aria-hidden="true" />
        </a>}
      </div>
    </article>
  );
}
