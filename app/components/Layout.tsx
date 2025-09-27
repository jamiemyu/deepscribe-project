import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ fontFamily: `Lexend, "Noto Sans", sans-serif` }}>
      <main className="main-content">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;