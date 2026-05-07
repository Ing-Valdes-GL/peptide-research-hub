import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Peptides Research Hub",
  description: "Learn more about Peptides Research Hub, our mission, and our commitment to peptide science innovation.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}