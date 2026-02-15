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
            <div className="header-links dropdown">
              <button className="br-button circle small" type="button" data-toggle="dropdown" aria-label="Abrir Acesso Rápido">
                <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
              </button>
              <div className="br-list">
                <div className="header">
                  <div className="title">Acesso Rápido</div>
                </div>
                <a className="br-item" href="#">Órgãos do Governo</a>
                <a className="br-item" href="#">Acesso à Informação</a>
                <a className="br-item" href="#">Legislação</a>
                <a className="br-item" href="#">Acessibilidade</a>
              </div>
            </div>
            <span className="br-divider vertical mx-half mx-sm-1"></span>
            <div className="header-functions dropdown">
              <button className="br-button circle small" type="button" data-toggle="dropdown" aria-label="Abrir Funcionalidades do Sistema">
                <i className="fas fa-th" aria-hidden="true"></i>
              </button>
              <div className="br-list">
                <div className="header">
                  <div className="title">Funcionalidades</div>
                </div>
                <div className="br-item">
                  <button className="br-button circle small" type="button" aria-label="Tema">
                    <i className="fas fa-cookie-bite" aria-hidden="true"></i>
                    <span className="text">Cookies</span>
                  </button>
                </div>
                <div className="br-item">
                  <button className="br-button circle small" type="button" aria-label="Contraste">
                    <i className="fas fa-circle-half-stroke" aria-hidden="true"></i>
                    <span className="text">Contraste</span>
                  </button>
                </div>
                <div className="br-item">
                  <button className="br-button circle small" type="button" aria-label="Aplicativos">
                    <i className="fas fa-th" aria-hidden="true"></i>
                    <span className="text">Aplicativos</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="header-login">
              <div className="header-sign-in">
                <button className="br-sign-in small" type="button">
                  <i className="fas fa-user" aria-hidden="true"></i>
                  <span className="d-sm-inline">Entrar com gov.br</span>
                </button>
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
          <div className="header-search">
            <div className="br-input has-icon">
              <label htmlFor="searchbox-header">Texto da pesquisa</label>
              <input id="searchbox-header" type="text" placeholder="O que você procura?" />
              <button className="br-button circle small" type="button" aria-label="Pesquisar">
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
