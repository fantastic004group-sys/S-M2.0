import ZoomScrollContainer from "./ZoomScrollContainer";
import Footer from "../layout/Footer";

interface ZoomPageProps {
  children: React.ReactNode | React.ReactNode[];
  includeFooter?: boolean;
}

/**
 * Wraps page content in a ZoomScrollContainer.
 * Each direct child becomes a full-viewport zoom section.
 * The footer is automatically appended as the final section.
 */
export default function ZoomPage({ children, includeFooter = true }: ZoomPageProps) {
  const sections = Array.isArray(children) ? children : [children];

  const allSections = includeFooter
    ? [
        ...sections,
        <div key="footer" className="h-full flex flex-col justify-end bg-[#1A1A1A]">
          <Footer />
        </div>,
      ]
    : sections;

  return <ZoomScrollContainer>{allSections}</ZoomScrollContainer>;
}

/**
 * A helper component to define a section within a ZoomPage.
 * Each ZoomSection fills the viewport and centers its content.
 */
export function ZoomSection({
  children,
  className = "",
  center = true,
}: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={`min-h-full ${center ? "flex items-center" : ""} ${className}`}>
      <div className="w-full">{children}</div>
    </div>
  );
}
