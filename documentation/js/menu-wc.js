'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">betterquizlet documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApiModule.html" data-type="entity-link" >ApiModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-d90bb9b24fb1f920bb7f20179a19de6be014f0549dffbaf5eae58a53bce9a80c605a3dd2abe3b54ef6b767177c5d300c04c30f820f1be14fb42e85f71306ed64"' : 'data-bs-target="#xs-controllers-links-module-AppModule-d90bb9b24fb1f920bb7f20179a19de6be014f0549dffbaf5eae58a53bce9a80c605a3dd2abe3b54ef6b767177c5d300c04c30f820f1be14fb42e85f71306ed64"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-d90bb9b24fb1f920bb7f20179a19de6be014f0549dffbaf5eae58a53bce9a80c605a3dd2abe3b54ef6b767177c5d300c04c30f820f1be14fb42e85f71306ed64"' :
                                            'id="xs-controllers-links-module-AppModule-d90bb9b24fb1f920bb7f20179a19de6be014f0549dffbaf5eae58a53bce9a80c605a3dd2abe3b54ef6b767177c5d300c04c30f820f1be14fb42e85f71306ed64"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' :
                                            'id="xs-controllers-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' :
                                        'id="xs-injectables-links-module-AuthModule-635a0d51636ded3545d6f32a9d09718a874f8c20cc0fe6ca76a59f3486af6f5bba8311b13c50ab89a33cf131447212e30bf5c06b1c607fadbc457581f57d08e6"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DeckModule.html" data-type="entity-link" >DeckModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' : 'data-bs-target="#xs-controllers-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' :
                                            'id="xs-controllers-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' }>
                                            <li class="link">
                                                <a href="controllers/DeckController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeckController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' : 'data-bs-target="#xs-injectables-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' :
                                        'id="xs-injectables-links-module-DeckModule-7e4a6d14d4ac5398edef7aa198a4beb90fe314902a47d680134b2ea621b5b3c404e27f066059c78f001ee5c78c13ad5a3c634be48e04e5be5db247f9b899d105"' }>
                                        <li class="link">
                                            <a href="injectables/DeckService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeckService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImageKitModule.html" data-type="entity-link" >ImageKitModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IntegrationModule.html" data-type="entity-link" >IntegrationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LangchainModule.html" data-type="entity-link" >LangchainModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' : 'data-bs-target="#xs-controllers-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' :
                                            'id="xs-controllers-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' }>
                                            <li class="link">
                                                <a href="controllers/FlowController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlowController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' : 'data-bs-target="#xs-injectables-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' :
                                        'id="xs-injectables-links-module-LangchainModule-c93805be385d2e41a622cf9bcbef64fb5dcc3bc40b9250fc36389050bd4f3e1bd495d655e6ce0660430296a3189599dc970062d2c642050c6b01141834f0b830"' }>
                                        <li class="link">
                                            <a href="injectables/EmbeddingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmbeddingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StoreService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-150d3c7bcb99ecaa9d34fd3542628d691a27665314f30cbfa3da657cf8bfdef5d855cd695bbdef5b3f3afc16769a5ab2c2ea807dbecd72d8b0ad142e142c75ef"' : 'data-bs-target="#xs-injectables-links-module-MailModule-150d3c7bcb99ecaa9d34fd3542628d691a27665314f30cbfa3da657cf8bfdef5d855cd695bbdef5b3f3afc16769a5ab2c2ea807dbecd72d8b0ad142e142c75ef"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-150d3c7bcb99ecaa9d34fd3542628d691a27665314f30cbfa3da657cf8bfdef5d855cd695bbdef5b3f3afc16769a5ab2c2ea807dbecd72d8b0ad142e142c75ef"' :
                                        'id="xs-injectables-links-module-MailModule-150d3c7bcb99ecaa9d34fd3542628d691a27665314f30cbfa3da657cf8bfdef5d855cd695bbdef5b3f3afc16769a5ab2c2ea807dbecd72d8b0ad142e142c75ef"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationModule.html" data-type="entity-link" >NotificationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' : 'data-bs-target="#xs-controllers-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' :
                                            'id="xs-controllers-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' : 'data-bs-target="#xs-injectables-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' :
                                        'id="xs-injectables-links-module-NotificationModule-2e4cf5668e4fcbbd5604da27af65f0f3e1b7f47025e8273453253493aa4378a7ddb9e88e55a9e6e8371498d62c51e45a255568739e4ea666eb8d58ff1ccf6821"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResendModule.html" data-type="entity-link" >ResendModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResendModule-dce0f2ed29dca4310604566bce1802d5325974cab4078a23f049226b84dc0d5296ef9a5ec61de734ac61c753dba01a201ca37673d2bf7d0b7a50c439764e636e"' : 'data-bs-target="#xs-injectables-links-module-ResendModule-dce0f2ed29dca4310604566bce1802d5325974cab4078a23f049226b84dc0d5296ef9a5ec61de734ac61c753dba01a201ca37673d2bf7d0b7a50c439764e636e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResendModule-dce0f2ed29dca4310604566bce1802d5325974cab4078a23f049226b84dc0d5296ef9a5ec61de734ac61c753dba01a201ca37673d2bf7d0b7a50c439764e636e"' :
                                        'id="xs-injectables-links-module-ResendModule-dce0f2ed29dca4310604566bce1802d5325974cab4078a23f049226b84dc0d5296ef9a5ec61de734ac61c753dba01a201ca37673d2bf7d0b7a50c439764e636e"' }>
                                        <li class="link">
                                            <a href="injectables/ResendService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResendService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StudyModule.html" data-type="entity-link" >StudyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' : 'data-bs-target="#xs-controllers-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' :
                                            'id="xs-controllers-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' }>
                                            <li class="link">
                                                <a href="controllers/StudyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StudyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' : 'data-bs-target="#xs-injectables-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' :
                                        'id="xs-injectables-links-module-StudyModule-de0d89431a6c90737bcc9401c5f8edee35c75f1b6e7cfbfc9dd8a8a13cc7fa5d8b1c0f116e001f2a34cd29f5f004366dc70ea4b68a84cf39a1695a780d7d9362"' }>
                                        <li class="link">
                                            <a href="injectables/StudyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StudyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' : 'data-bs-target="#xs-controllers-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' :
                                            'id="xs-controllers-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' : 'data-bs-target="#xs-injectables-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' :
                                        'id="xs-injectables-links-module-UserModule-ed6f386655b395054e9480e4888b67384983daa15496eebb5ee60fb48dfdf3d3ac974304e00cf3e1c7027a66ab32d94542bf66359af9d9e065a6645f98b03578"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Card.html" data-type="entity-link" >Card</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Deck.html" data-type="entity-link" >Deck</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Notification.html" data-type="entity-link" >Notification</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Session.html" data-type="entity-link" >Session</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserStatistic.html" data-type="entity-link" >UserStatistic</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ActorDto.html" data-type="entity-link" >ActorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppEnvVariables.html" data-type="entity-link" >AppEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthEnvVariables.html" data-type="entity-link" >AuthEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardAnswerDto.html" data-type="entity-link" >CardAnswerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardDto.html" data-type="entity-link" >CardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloneDeckDto.html" data-type="entity-link" >CloneDeckDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCardDto.html" data-type="entity-link" >CreateCardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDeckDto.html" data-type="entity-link" >CreateDeckDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDeckResDto.html" data-type="entity-link" >CreateDeckResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseEnvVariables.html" data-type="entity-link" >DatabaseEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseSeeder.html" data-type="entity-link" >DatabaseSeeder</a>
                            </li>
                            <li class="link">
                                <a href="classes/Deck.html" data-type="entity-link" >Deck</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeckDto.html" data-type="entity-link" >DeckDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeckStatsDto.html" data-type="entity-link" >DeckStatsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorDetailDto.html" data-type="entity-link" >ErrorDetailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorDto.html" data-type="entity-link" >ErrorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExchangeTokenDto.html" data-type="entity-link" >ExchangeTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetManyQueryDto.html" data-type="entity-link" >GetManyQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetManyResDto.html" data-type="entity-link" >GetManyResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOneResDto.html" data-type="entity-link" >GetOneResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSharedManyResDto.html" data-type="entity-link" >GetSharedManyResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSharedOneResDto.html" data-type="entity-link" >GetSharedOneResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlobalExceptionFilter.html" data-type="entity-link" >GlobalExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleEnvVariables.html" data-type="entity-link" >GoogleEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageKitEnvVariables.html" data-type="entity-link" >ImageKitEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailEnvVariables.html" data-type="entity-link" >MailEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetadataDto.html" data-type="entity-link" >MetadataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationDto.html" data-type="entity-link" >NotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationGateway.html" data-type="entity-link" >NotificationGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerDto.html" data-type="entity-link" >OwnerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedDto.html" data-type="entity-link" >PaginatedDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreviewCardDto.html" data-type="entity-link" >PreviewCardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryDto.html" data-type="entity-link" >QueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RedisEnvVariables.html" data-type="entity-link" >RedisEnvVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResendProcessor.html" data-type="entity-link" >ResendProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveAnswersDto.html" data-type="entity-link" >SaveAnswersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketIOAdapter.html" data-type="entity-link" >SocketIOAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteBaseEntity.html" data-type="entity-link" >SoftDeleteBaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/StudyProcessor.html" data-type="entity-link" >StudyProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenPairDto.html" data-type="entity-link" >TokenPairDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCardDto.html" data-type="entity-link" >UpdateCardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateDeckDto.html" data-type="entity-link" >UpdateDeckDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadAvatarDto.html" data-type="entity-link" >UploadAvatarDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserProcessor.html" data-type="entity-link" >UserProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserStatsDto.html" data-type="entity-link" >UserStatsDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ServerToClientEvents.html" data-type="entity-link" >ServerToClientEvents</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});