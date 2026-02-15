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
              <img
                src="/govbr.webp"
                alt="logo gov.br"
              />
            </a>
            <span className="br-divider vertical"></span>
            <div className="header-sign">Ministério do Desenvolvimento, Indústria, Comércio e Serviços</div>
          </div>
          <div className="header-actions">
            <div className="header-links">
              <div className="br-list">
                <a className="br-item" href="https://www.gov.br/pt-br/orgaos-do-governo">Órgãos do Governo</a>
                <a className="br-item" href="https://www.gov.br/acessoainformacao/pt-br">Acesso à Informação</a>
                <a className="br-item" href="http://www4.planalto.gov.br/legislacao">Legislação</a>
                <a className="br-item" href="https://www.gov.br/governodigital/pt-br/acessibilidade-digital">Acessibilidade</a>
              </div>
            </div>
            <div className="header-login header-login-right">
              <div className="header-sign-in">
                <a className="br-sign-in small" href="https://www.gov.br/governodigital/pt-br/acessibilidade-digital">
                  <i className="fas fa-user" aria-hidden="true"></i>
                  <span className="d-sm-inline">Entrar com gov.br</span>
                </a>
              </div>
              <div className="header-avatar"></div>
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <div className="header-menu">
            <div className="header-menu-trigger">
              <button className="br-button small circle" type="button" aria-label="Menu">
                <i className="fas fa-bars" aria-hidden="true"></i>
              </button>
            </div>
            <div className="header-info">
              <div className="header-title">Instituto Nacional da Propriedade Industrial</div>
            </div>
          </div>
          <div className="header-search justify-end">
            <span className="header-knowledge-title">Portal da Gestão do Conhecimento</span>
          </div>
        </div>
      </div>
    </header>
  );
}
