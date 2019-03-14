/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const {config: siteConfig} = props;
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${
    siteConfig.projectName
  }`;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} 版本</h1>
          </header>
          <h3 id="latest">当前版本 (稳定)</h3>
          <p>BUMO项目的最新版本.</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language
                    }introduction_to_bumo`}>
                    文档中心
                  </a>
                </td>
                <td>
                  <a href={`${repoUrl}/releases/tag/${latestVersion}`}>
                    发布说明
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">最新版本</h3>
          这里你能找到最新版本的文档和未发布的源码.
          <table className="versions">
            <tbody>
              <tr>
                <th>master</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language
                    }next/introduction_to_bumo`}>
                    文档中心
                  </a>
                </td>
                <td>
                  <a href={repoUrl}>源码</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="archive">旧版本</h3>
          <p>
            这里你能找到 BUMO 文档中心之前的版本。
          </p>
          <table className="versions">
            <tbody>
              {versions.map(
                version =>
                  version !== latestVersion && (
                    <tr key={version}>
                      <th>{version}</th>
                      <td>
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                            props.language
                          }${version}/introduction_to_bumo`}>
                          文档中心
                        </a>
                      </td>
                      <td>
                        <a href={`${repoUrl}/releases/tag/${version}`}>
                          发布说明
                        </a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <p>
            你能在{' '}
            <a href={`${repoUrl}/releases`}>GitHub</a>
            {' '}找到这个项目的旧版本。
          </p>
        </div>
      </Container>
    </div>
  );
}

Versions.title = 'Versions';

module.exports = Versions;
