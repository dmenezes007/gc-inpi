'use client';

import { useEffect } from 'react';

export function GovBrFooter() {
  useEffect(() => {
    let mounted = true;

    const initializeFooter = async () => {
      const element = document.querySelector('.br-footer');

      if (!mounted || !element || element.dataset.brFooterInitialized === 'true') {
        return;
      }

      try {
        const module = await import('@govbr-ds/core/dist/core.min.js');
        const BRFooter = module?.BRFooter;

        if (BRFooter) {
          new BRFooter('br-footer', element);
          element.dataset.brFooterInitialized = 'true';
        }
      } catch {
      }
    };

    void initializeFooter();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="br-footer pt-3">
      <div className="container-lg">
        <div className="logo">
          <img src="/logo_inpi_branco_fundo_transparente.png" alt="Logo INPI" style={{ maxHeight: '48px' }} />
        </div>
      </div>
      <span className="br-divider my-3"></span>
      <div className="container-lg">
        <div className="info">
          <div className="text-down-01 text-medium pb-3">
            Instituto Nacional da Propriedade Industrial · Portal da Gestão do Conhecimento.
          </div>
        </div>
      </div>
    </footer>
  );
}
