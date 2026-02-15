'use client';

import { useEffect } from 'react';

export function GovBrHeader() {
  useEffect(() => {
    let mounted = true;

    const initializeHeader = async () => {
      const element = document.querySelector('.br-header');

      if (!mounted || !element || element.dataset.brHeaderInitialized === 'true') {
        return;
      }

      try {
        const module = await import('@govbr-ds/core/dist/core.min.js');
        const BRHeader = module?.BRHeader;

        if (BRHeader) {
          new BRHeader('br-header', element);
          element.dataset.brHeaderInitialized = 'true';
        }
      } catch {
      }
    };

    void initializeHeader();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="br-header" data-sticky="data-sticky">
      <div className="container-lg">
        <div className="header-top">
          <div className="header-logo">
            <a href="/" aria-label="Página inicial">
              <span className="header-sign">Padrão Digital de Governo</span>
            </a>
          </div>
        </div>
        <div className="header-bottom">
          <div className="header-menu">
            <div className="header-info">
              <div className="header-title">GC INPI</div>
              <div className="header-subtitle">Gestão do Conhecimento e Inovação</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
