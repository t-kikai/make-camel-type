import type { Component } from 'solid-js';
import { createEffect, createMemo, createSignal } from 'solid-js';
import styles from './App.module.css';
import { getJsonTypeDefinition } from './formatter';
import { Box, Grid, TextField } from '@suid/material';

const App: Component = () => {
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
          : `type Output = {\n${indentedDefinition}\n}`;
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

  return (
    <div class={styles.App}>
      <h1 class="p-5">MakeCamelType</h1>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid item xs={6} md={6}>
            <TextField
              label="Multiline"
              multiline
              minRows={4}
              maxRows={48}
              fullWidth
              value={inputObj()}
              onChange={e => {
                setInputObj(e.currentTarget.value);
              }}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            {/* 出力部分をtextarea要素に変更 */}
            <textarea
              id="output"
              class={styles.LeftAlignedPre}
              readonly
              style={{
                'white-space': 'pre-wrap',
                'text-align': 'left',
                width: '100%',
                height: '100%',
                padding: '12px',
              }}
              value={outPut()} // outPut関数の結果を表示
            />
            <button id="copy-button">Copy to Clipboard</button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default App;
