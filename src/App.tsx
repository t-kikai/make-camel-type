import type { Component } from 'solid-js';
import { createEffect, createMemo, createSignal } from 'solid-js';
import styles from './App.module.css';
import { getJsonTypeDefinition } from './formatter';
import { Box, Grid, IconButton, TextField } from '@suid/material';
import ContentCopyIcon from '@suid/icons-material/ContentCopy';
import { MetaProvider, Title, Link } from '@solidjs/meta';

const App: Component = () => {
  <MetaProvider>
    <div class="Home">
      <Title>Title of page</Title>
      <Link rel="canonical" href="http://solidjs.com/" />
      <meta
        property="og:image"
        content="https://make-camel-type.vercel.app/images/ogp.png"
      />
    </div>
  </MetaProvider>;

  const exampleJson = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    address: {
      city: 'New York',
      zipcode: '10001',
    },
    hobbies: ['reading', 'gaming'],
    friends: [
      {
        name: 'Alice',
        age: 28,
        email: 'alice@example.com',
      },
      {
        name: 'Bob',
        age: 32,
        email: 'bob@example.com',
        address: {
          city: 'Los Angeles',
          zipcode: '90001',
        },
      },
    ],
  };

  const [inputObj, setInputObj] = createSignal(
    JSON.stringify(exampleJson, null, 2),
  );

  // getJsonTypeDefinition関数の結果を整形するためのユーティリティ関数
  const formatTypeDefinition = (typeDefinition: string): string => {
    const lines = typeDefinition
      .trim()
      .split('\n')
      .map(line => line.trim());
    return lines.join('\n');
  };

  // カンマを除去するためのユーティリティ関数
  const removeCommas = (typeDefinition: string): string => {
    return typeDefinition.replace(/,/g, '');
  };

  // 以下はAppコンポーネント内のreturn部分の一部です
  const outPut = createMemo(() => {
    try {
      const parsedJson = JSON.parse(inputObj());
      const typeDefinition = getJsonTypeDefinition(parsedJson);
      const formattedTypeDefinition = formatTypeDefinition(typeDefinition);
      const typeDefinitionWithoutCommas = removeCommas(formattedTypeDefinition);
      let indentedDefinition = typeDefinitionWithoutCommas.replace(/^/gm, '  ');

      // 先頭と末尾の中括弧とスペースを除去
      indentedDefinition = indentedDefinition
        .replace(/^\s*{\n/, '')
        .replace(/\n\s*}$/, '');

      const outputTypeDefinition =
        indentedDefinition === '{}'
          ? ''
          : `export type Output = {\n${indentedDefinition}\n}`;
      return outputTypeDefinition;
    } catch (error) {
      return '';
    }
  });

  // クリップボードにコピーする関数
  const copyToClipboard = (): void => {
    const outputElement = document.getElementById('output') as HTMLInputElement;
    if (outputElement != null) {
      outputElement.select();
      document.execCommand('copy');
    }
  };

  // createEffectを使ってクリップボードにコピーするイベントを監視
  createEffect(() => {
    const copyButton = document.getElementById('copy-button');
    if (copyButton != null) {
      copyButton.addEventListener('click', copyToClipboard);
    }
    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => {
      if (copyButton != null) {
        copyButton.removeEventListener('click', copyToClipboard);
      }
    };
  });

  const maxRows = 24;

  return (
    <div class={styles.App}>
      <h1 class={`p-5`}>
        <span class={`${styles.themeGrad}`}>MakeCamelTypes</span> from JSON
        samples
      </h1>

      <Box sx={{ flexGrow: 1 }} px={5}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} textAlign="left">
            <h2>Input: JSON Examples</h2>
            Enter a single JSON object or an array of JSON objects.
            <TextField
              multiline
              minRows={maxRows}
              maxRows={maxRows}
              fullWidth
              value={inputObj()}
              onChange={e => {
                setInputObj(e.currentTarget.value);
              }}
            />
          </Grid>

          <Grid item xs={6} md={6} textAlign="left">
            <h2>Output: TypeScript Interfaces</h2>
            Use this if you want to statically type check interactions with JSON
            objects.
            <div style={{ position: 'relative' }}>
              <div
                class="p-4 justify-end flex w-full"
                style={{ position: 'absolute', top: 0, right: 0, 'z-index': 2 }}
              >
                <IconButton
                  id="copy-button"
                  aria-label="add an alarm"
                  color="primary"
                >
                  <ContentCopyIcon />
                </IconButton>
              </div>
              <TextField
                id="output"
                multiline
                minRows={maxRows}
                maxRows={maxRows}
                fullWidth
                class="bg-gray-100 border-1"
                value={outPut()}
                inputProps={{ readonly: true }}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default App;
