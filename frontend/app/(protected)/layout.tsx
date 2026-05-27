import ProtectedLayoutWrapper from "@/app/components/layout/ProtectedLayoutWrapper";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayoutWrapper>{children}</ProtectedLayoutWrapper>;
}