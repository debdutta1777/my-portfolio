import Image from 'next/image';

export default function KolkataBackground() {
  return (
    <picture className="kolkata" aria-hidden="true" data-kolkata>
      <source type="image/webp" srcSet="/images/kolkata-editorial-background.webp" />
      <Image
        src="/images/kolkata-editorial-background.png"
        alt=""
        width={1672}
        height={941}
        loading="eager"
        fetchPriority="high"
      />
    </picture>
  );
}
