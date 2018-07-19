// @flow
import * as React from "react";
import styled from "react-emotion";
import { observer } from "inferno-mobx";
import Button from "../../../components/Button";
import type { RootStore } from "../../../root-store";
import { withTheme } from "../../../utils/theming";

const Container = withTheme(styled("div")`
  padding: 20px;
  padding-top: 10%;
  max-width: 768px;
  margin: 0 auto;
`);

const ContentLink = withTheme(styled("a")`
  text-decoration: none;
  color: ${p => p.theme.primaryColor};
`);

const Content = styled("div")`
  font-size: 18px;
  padding-bottom: 20px;
  & p {
    padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
  }
`;

const Logo = styled("img")`
  max-width: 320px;
  height: auto;
  display: block;
  margin-bottom: 20px;
`;

export type Props = {
  rootStore: RootStore
};

const Homepage = ({ rootStore }: Props) => {
  return (
    <Container>
      {/* $FlowFixMe */}
      <Logo
        src={require(`../../../assets/logo-${
          rootStore.themeStore.theme.id
        }.svg`)}
      />
      <Content>
        <p>
          Posish is a tool that helps you generate code with character
          positions. Write or paste in some text, highlight areas of interest
          and generate some code. The primary use case for this is writing tests
          for parsers.
        </p>
        <p>
          All data is stored locally using <code>localStorage</code>, and the
          app is accessible offline.
        </p>
        <p>
          Created by Jeff Hansen -{" "}
          <ContentLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/Jeffijoe"
          >
            @jeffijoe
          </ContentLink>
        </p>
      </Content>
      <Button onClick={() => rootStore.workspaceStore.newWorkspace()}>
        Create from scratch
      </Button>
      &nbsp;&nbsp;<small>or</small>&nbsp;&nbsp;
      <Button onClick={() => rootStore.workspaceStore.loadExample()}>
        Load an example
      </Button>
    </Container>
  );
};

export default (observer(Homepage): typeof Homepage);
