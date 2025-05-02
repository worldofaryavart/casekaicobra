export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-background to-secondary/10 px-4 py-8">
        <div className="max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    );
  }