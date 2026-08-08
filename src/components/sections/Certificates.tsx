import { SectionTitle } from '@/components/SectionTitle';
import { CertificateCard } from '@/components/CertificateCard';
import { certificates } from '@/constants/experience';

export function Certificates() {
  return (
    <section id="certificates" className="relative py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Certificates"
          title="Learning, formally"
          description="Courses and certifications I've completed to deepen my foundations — verified credentials linked on each card."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <CertificateCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
