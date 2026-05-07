import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Products | Peptides Research Hub",
  description: "Explore the full range of high-quality peptide research compounds offered by Peptides Research Hub.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}