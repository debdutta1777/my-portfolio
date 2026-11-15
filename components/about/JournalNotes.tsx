'use client';

import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import styles from './journal.module.css';

type Note = { title: string; content: ReactNode };

export default function JournalNotes({ notes, kind }: { notes: readonly Note[]; kind: 'identity' | 'toolkit' | 'beyond' }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const groupStyle = kind === 'beyond' ? styles.scraps : kind === 'toolkit' ? styles.toolkit : styles.identityNotes;
  const itemStyle = kind === 'beyond' ? styles.scrap : kind === 'toolkit' ? styles.toolCard : styles.identityNote;

  return (
    <div className={`${groupStyle} ${styles.noteGroup}`}>
      {notes.map(({ title }, index) => (
        <div className={itemStyle} data-selected={selected === index} key={title}>
          <button
            type="button"
            className={styles.noteButton}
            id={`${id}-button-${index}`}
            aria-expanded={selected === index}
            aria-controls={`${id}-note-${index}`}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse' && window.matchMedia('(any-hover: hover)').matches) setSelected(index);
            }}
            onFocus={() => setSelected(index)}
            onClick={() => setSelected(index)}
          >
            {title}<Plus className={styles.toggle} size={18} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div className={styles.notePanels}>
        {notes.map(({ title, content }, index) => (
          <div
            className={`${styles.notePanel} ${kind === 'beyond' ? styles.scrap : kind === 'identity' ? styles.identityPanel : ''}`}
            id={`${id}-note-${index}`}
            role="region"
            aria-labelledby={`${id}-button-${index}`}
            aria-hidden={selected !== index}
            key={title}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
