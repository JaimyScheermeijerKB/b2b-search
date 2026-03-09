export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <a href="/" className="font-semibold text-xl text-muted-foreground hover:text-foreground">
            B2B Visitor
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}
