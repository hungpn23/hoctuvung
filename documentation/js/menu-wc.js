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
                                            'data-bs-target="#controllers-links-module-AppModule-0954b04951f4a2f5d09a4d5a6b4c18ed7db91e8f06696fd44cc58c2cb88be1d5f1bfb5c77f0e9526da8d94343f5abdca19df7a37557e1776e9482d43a7b588cb"' : 'data-bs-target="#xs-controllers-links-module-AppModule-0954b04951f4a2f5d09a4d5a6b4c18ed7db91e8f06696fd44cc58c2cb88be1d5f1bfb5c77f0e9526da8d94343f5abdca19df7a37557e1776e9482d43a7b588cb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-0954b04951f4a2f5d09a4d5a6b4c18ed7db91e8f06696fd44cc58c2cb88be1d5f1bfb5c77f0e9526da8d94343f5abdca19df7a37557e1776e9482d43a7b588cb"' :
                                            'id="xs-controllers-links-module-AppModule-0954b04951f4a2f5d09a4d5a6b4c18ed7db91e8f06696fd44cc58c2cb88be1d5f1bfb5c77f0e9526da8d94343f5abdca19df7a37557e1776e9482d43a7b588cb"' }>
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
                                            'data-bs-target="#controllers-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' :
                                            'id="xs-controllers-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' :
                                        'id="xs-injectables-links-module-AuthModule-c1fa6f08fd5b9f0b9653494382b491ec2d392de6fb4ecca2e9918df8c8112479adf80530b12933273638327923a9302ca43bd5c1587824edbc5fb123e6900adf"' }>
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
                                            'data-bs-target="#controllers-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' : 'data-bs-target="#xs-controllers-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' :
                                            'id="xs-controllers-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' }>
                                            <li class="link">
                                                <a href="controllers/DeckController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeckController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' : 'data-bs-target="#xs-injectables-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' :
                                        'id="xs-injectables-links-module-DeckModule-891b93d775677f3a9045c04e5ab7f72b5667b98ca5f16d00c41a1549be8f3dc9152608a130f62bd3011e79b41d069d4b8a553520d7c8873aa929125c674c03de"' }>
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
                                <a href="modules/StudyModule.html" data-type="entity-link" >StudyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' : 'data-bs-target="#xs-controllers-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' :
                                            'id="xs-controllers-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' }>
                                            <li class="link">
                                                <a href="controllers/StudyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StudyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' : 'data-bs-target="#xs-injectables-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' :
                                        'id="xs-injectables-links-module-StudyModule-6be79c7270bd83762ecc72d4227a74616b836bbdebb20bd963a004f37c7ae3be02aa531f251c4f559d52a675cad3c20b1b1e63e956caeba7a19c7701863301ad"' }>
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
                                            'data-bs-target="#controllers-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' : 'data-bs-target="#xs-controllers-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' :
                                            'id="xs-controllers-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' : 'data-bs-target="#xs-injectables-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' :
                                        'id="xs-injectables-links-module-UserModule-c8ef5a06f02546ad2e86d50f224dde1006cb59af6bbbc1f284878a6d7413ff35f09f1903b8f00a1a52030ee95cf41a517a9f36dfbf2ff4440628024111c8a8d7"' }>
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
                                <a href="classes/DeckQueryDto.html" data-type="entity-link" >DeckQueryDto</a>
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
                                <a href="classes/GetManyResDto.html" data-type="entity-link" >GetManyResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOneResDto.html" data-type="entity-link" >GetOneResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSharedManyResDto.html" data-type="entity-link" >GetSharedManyResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSharedQueryDto.html" data-type="entity-link" >GetSharedQueryDto</a>
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
                                <a href="classes/MetadataDto.html" data-type="entity-link" >MetadataDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Migration20251221163913.html" data-type="entity-link" >Migration20251221163913</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedDto.html" data-type="entity-link" >PaginatedDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublicDeckDto.html" data-type="entity-link" >PublicDeckDto</a>
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
                                <a href="classes/SaveAnswersDto.html" data-type="entity-link" >SaveAnswersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SoftDeleteBaseEntity.html" data-type="entity-link" >SoftDeleteBaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/StudyProcessor.html" data-type="entity-link" >StudyProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/StudySessionDto.html" data-type="entity-link" >StudySessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/StudySessionStateDto.html" data-type="entity-link" >StudySessionStateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmitReviewDto.html" data-type="entity-link" >SubmitReviewDto</a>
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