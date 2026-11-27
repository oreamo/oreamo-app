import { useState } from "react";

import { styled } from "@mui/material";

import { Grid } from "@/components/common/layout/Grid";
import { DataEditor } from "@/components/data-editor/DataEditor";
import { DataViewer } from "@/components/data-editor/DataViewer";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

export function DevEditorPage() {
  const [markdown, setMarkdown] = useState(`# Markdown

## Heading

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Text

**Bold**, *Italic*, ~~Strikethrough~~ and \`Inline Code\`

Markdown 문서는 여러 줄로 이어지는 긴 문단에서 줄 간격이 자연스러워야 합니다. 한글과 English가 섞인 문장이 화면 너비를 넘어 여러 줄로 줄바꿈될 때도 읽기 편해야 합니다.

## Link

[Oreamo](https://github.com/oreamo) and https://github.com/oreamo

## Image

![Vite](/vite.svg)

## List

- Item 1
- Item 2
  - Nested Item
    - Deep Nested Item

## Ordered List

1. First
2. Second
   1. Nested First
   2. Nested Second
3. Third

## Task

- [x] Done
- [ ] Todo

## Table

| Name | Description | Align Left | Align Center | Align Right |
| --- | --- | :--- | :---: | ---: |
| Editor | @uiw/react-md-editor | Left | Center | Right |
| Viewer | react-markdown | Left | Center | Right |
| Long | 표 안의 내용이 길어서 셀 너비를 넘어가는 경우에 줄바꿈이 어떻게 되는지 확인합니다 | Left | Center | Right |

## Code

\`\`\`ts
interface Message {
  id: number;
  text: string;
}

export function printMessage({ id, text }: Message) {
  const prefix = \`#\${id}\`;
  console.log(prefix, text, true, null);
}
\`\`\`

\`\`\`
Plain code block without language
\`\`\`

## Blockquote

> Blockquote
> 여러 줄로 이어지는 인용문입니다.
>
> > Nested Blockquote

## Horizontal Rule

---
`);

  const handleMarkdownChange = (value?: string) => {
    setMarkdown(value ?? "");
  };

  return (
    <PageLayout>
      <Grid columns={{ desktop: 2, tablet: 1, phone: 1 }} gap={4}>
        <DevComponentCard title="Editor (@uiw/react-md-editor)">
          <DataEditor
            value={markdown}
            height={600}
            onChange={handleMarkdownChange}
          />
        </DevComponentCard>

        <DevComponentCard title="Viewer (react-markdown)">
          <StyledDataViewer value={markdown} />
        </DevComponentCard>
      </Grid>
    </PageLayout>
  );
}

const StyledDataViewer = styled(DataViewer)({
  height: 600,

  overflow: "auto",
});
