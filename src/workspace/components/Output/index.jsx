import * as React from 'react'
import cx from 'classnames'
import Button from '../../../components/Button'
import { observer } from 'inferno-mobx'
import { css } from 'emotion'
import { withTheme } from '../../../utils/theming'

const Output = ({ workspace, theme }) => {
  const styles = {
    /* eslint-disable indent */
    root: css`
      padding: 10px;
      overflow-y: auto;
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    `,
    output: css`
      box-shadow: 0 1px 2px rgba(20, 30, 40, 0.1);
      margin-bottom: 10px;
    `,
    outputHeader: css`
      padding: 10px;
      display: flex;
      align-items: center;
      ${{
        light: css`
          background-color: #fff;
        `,
        dark: css`
          background-color: #404049;
        `
      }[theme.id]}
    `,
    outputColor: css`
      border-radius: 50%;
      width: 12px;
      height: 12px;
      flex: 0 0 auto;
    `,
    outputName: css`
      display: inline-block;
      padding: 4px;
      flex: 1 1 auto;
    `,
    outputActions: css`
      flex: 0 0 auto;
    `,
    outputContent: css`
      overflow: auto;
      white-space: pre;
      padding: 10px;
      font-family: 'courier new';
      ${{
        light: css`
          background-color: #fafafe;
        `,
        dark: css`
          background-color: #505059;
        `
      }[theme.id]}
    `
    /* eslint-enable indent */
  }

  return (
    <div className={cx(styles.root)}>
      {typeof workspace.output === 'string'
        ? (
          <div className={css`padding: 20px; text-align: center;`}>
            Template error: {workspace.output}
          </div>
        )
        : workspace.output.length === 0
          ? (
            <div
              className={css`
                text-align: center;
                padding: 8% 20px;
                opacity: 0.7;
                `
              }
            >
              As you highlight fragments, they will show up here with the rendered template.
            </div>
          )
          : workspace.output.map(o =>
              <div key={o.color} className={styles.output}>
                <div className={cx(styles.outputHeader)}>
                  <div
                    className={styles.outputColor}
                    style={{
                      backgroundColor: o.color
                    }}
                  >
                  </div>
                  &nbsp;
                  <div className={styles.outputName}>
                    {o.text}
                  </div>
                  <div className={styles.outputActions}>
                    <Button small onClick={() => workspace.copyOutput(o)}>Copy</Button>
                  </div>
                </div>
                <div className={styles.outputContent}>
                  {o.content}
                </div>
              </div>
            )
      }

    </div>
  )
}

export default withTheme(observer(Output))
