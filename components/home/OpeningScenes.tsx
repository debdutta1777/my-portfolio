import Image from 'next/image';

export const roles = ['STUDENT', 'DEVELOPER', 'EXPLORER'] as const;

export function OpeningScenes() {
  return (
    <div className="opening-scenes">
      <div className="roles" aria-hidden="true">
        {roles.map((role) => (
          <div className="role-scene" key={role} data-role={role.toLowerCase()}>
            <span className="role-mask"><span data-word>{role}<span>.</span></span></span>
            <span className="role-stroke" data-role-stroke />
          </div>
        ))}
      </div>
      <div className="portrait" data-portrait>
        <Image src="/images/debdutta-portrait-rustic.png" alt="Debdutta Ghosh looking back over her shoulder" width={1086} height={1448} preload />
      </div>
    </div>
  );
}

export function SceneProgress() {
  return (
    <div className="intro-controls">
      <div className="scene-indicator" aria-hidden="true">
        {roles.map((role) => <span key={role} data-progress={role.toLowerCase()} />)}
      </div>
    </div>
  );
}
