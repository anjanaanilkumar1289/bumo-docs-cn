/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    /*const langPart = `${language ? `${language}/` : ''}`;*/
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer index-top">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );


    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.secTitle}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('introduction_to_bumo')}>快速入门</Button>
            <Button target='_blank' href={'https://github.com/bumoproject/bumo'}>Github</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content: 'Talk about trying this out',
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'left',
            title: 'Try it Out',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content: 'Talk about learning how to use this',
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'right',
            title: 'Learn How',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'This is the content of my feature',
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'top',
            title: 'Feature One',
          },
          {
            content: 'The content of my second feature',
            image: `${baseUrl}img/docusaurus.svg`,
            imageAlign: 'top',
            title: 'Feature Two',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };
    
    const FeatureCard = props => {
      return (
        <div className="card-item">
          <div className="item-top">
            <div className="item-img">
              <img src={props.image} />
            </div>
            <div className="item-name">{props.name}</div>
          </div>
          <ul className="link-list">
            {
              props.linkList.map((item, index) => {
                if (index < 3) {
                  return (
                    <li key={index} className="link-item">
                      <a href={item.url}>{item.label}</a>
                    </li>
                  )
                }
              })
            }
          </ul>
          {props.linkList.length > 3 &&
            <a className="link-all" href={props.linkList[0].url}>更多</a>
          }
        </div>
      )
    }
    
    const featureArray = [
      {
        image: `${baseUrl}img/index/contract.png`,
        name: '智能合约',
        linkList: [
          {
            url: `${baseUrl}docs/introduction_to_smart_contract`,
            label: '介绍'
          },
          {
            url: `${baseUrl}docs/contract_new_interfaces`,
            label: '新接口'
          },
          {
            url: `${baseUrl}docs/syntax_in_smart_contract`,
            label: '语法'
          },
          {
            url: `${baseUrl}docs/codemach_editor_user_guide`,
            label: '合约编辑器'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/beps.png`,
        name: 'BEPs协议',
        linkList: [
          {
            url: `${baseUrl}docs/introduction_to_beps`,
            label: '介绍'
          },
          {
            url: `${baseUrl}docs/atp_10`,
            label: 'ATP-10'
          },
          {
            url: `${baseUrl}docs/atp_20`,
            label: 'ATP-20'
          },
          {
            url: `${baseUrl}docs/atp_30`,
            label: 'ATP-30'
          },
          {
            url: `${baseUrl}docs/sto_10`,
            label: 'STO-10'
          },
          {
            url: `${baseUrl}docs/dex_10`,
            label: 'DEX-10'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/api.png`,
        name: 'API',
        linkList: [
          {
            url: `${baseUrl}docs/keypair_guide`,
            label: 'Keypair'
          },
          {
            url: `${baseUrl}docs/api_http`,
            label: 'HTTP'
          },
          {
            url: `${baseUrl}docs/api_websocket`,
            label: 'Websocket'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/sdk.png`,
        name: 'SDK',
        linkList: [
          {
            url: `${baseUrl}docs/sdk_java`,
            label: 'JAVA'
          },
          {
            url: `${baseUrl}docs/sdk_nodejs`,
            label: 'Node.js'
          },
          {
            url: `${baseUrl}docs/sdk_go`,
            label: 'GO'
          },
          {
            url: `${baseUrl}docs/sdk_php`,
            label: 'PHP'
          },
          {
            url: `${baseUrl}docs/sdk_ios`,
            label: 'IOS'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/docs.png`,
        name: '开发指南',
        linkList: [
          {
            url: `${baseUrl}docs/integration_guide_for_exchanges`,
            label: '交易所对接'
          },
          {
            url: `${baseUrl}docs/asset_issuance_development_guide_for_java`,
            label: '资产发行 Java 开发'
          },
          {
            url: `${baseUrl}docs/asset_issuance_development_guide_for_java`,
            label: '存证 Java 开发'
          },
          {
            url: `${baseUrl}docs/smart_contract_development_guide`,
            label: '智能合约 Java 开发'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/wallet.png`,
        name: '钱包',
        linkList: [
          {
            url: `${baseUrl}docs/quick_wallet_user_guide`,
            label: '轻钱包'
          },
          {
            url: `${baseUrl}docs/bupocket_user_guide`,
            label: '小布口袋 APP'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/tools.png`,
        name: '工具箱',
        linkList: [
          {
            url: `${baseUrl}docs/tool_application_scenario`,
            label: '工具应用场景示例'
          },
          {
            url: `${baseUrl}docs/keypair_generator_user_guide`,
            label: 'keypair生成器'
          },
          {
            url: `${baseUrl}docs/faucet_user_guide`,
            label: '水龙头'
          }
        ]
      },
      {
        image: `${baseUrl}img/index/glossary.png`,
        name: '术语',
        linkList: [
          {
            url: `${baseUrl}docs/terminology`,
            label: '术语'
          }
        ]
      }
    ]
    
    return (
      <div className="index-cont">
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="feature-list-cont">
          {
            featureArray.map(item => (
              <FeatureCard key={item.name} image={item.image} name={item.name} linkList={item.linkList} />
            ))
          }
        </div>
      </div>
    );
  }
}

module.exports = Index;
