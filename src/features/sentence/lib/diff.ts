import type {
  ChangeBlock,
  ChangeHighlightsResult,
  ChangeKind,
  RefinedSegment,
} from '../types';

type DiffOp =
  | { op: 'equal'; tokens: string[] }
  | { op: 'insert'; tokens: string[] }
  | { op: 'delete'; tokens: string[] };

const joinTokens = (tokens: string[]) => tokens.join('');

const tokenize = (text: string): string[] => {
  if (!text) return [];

  const Segmenter = (Intl as typeof Intl | undefined)?.Segmenter;
  if (Segmenter) {
    const segmenter = new Segmenter('en', { granularity: 'word' });
    return Array.from(segmenter.segment(text)).map((segment) => segment.segment);
  }

  const fallback =
    text.match(/[\p{L}\p{N}]+|\s+|[^\s\p{L}\p{N}]+/gu)?.filter(Boolean) ?? [];

  return fallback;
};

const buildLcsTable = (a: string[], b: string[]) => {
  const rows = a.length;
  const cols = b.length;
  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    Array.from({ length: cols + 1 }, () => 0),
  );

  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }

  return table;
};

const diffTokens = (original: string[], refined: string[]): DiffOp[] => {
  const table = buildLcsTable(original, refined);
  const ops: DiffOp[] = [];

  const pushOp = (op: DiffOp) => {
    if (!op.tokens.length) return;
    const last = ops[ops.length - 1];
    if (last && last.op === op.op) {
      last.tokens.push(...op.tokens);
      return;
    }
    ops.push({ ...op });
  };

  let i = 0;
  let j = 0;

  while (i < original.length && j < refined.length) {
    if (original[i] === refined[j]) {
      pushOp({ op: 'equal', tokens: [original[i]] });
      i += 1;
      j += 1;
      continue;
    }

    if (table[i + 1][j] >= table[i][j + 1]) {
      pushOp({ op: 'delete', tokens: [original[i]] });
      i += 1;
    } else {
      pushOp({ op: 'insert', tokens: [refined[j]] });
      j += 1;
    }
  }

  if (i < original.length) {
    pushOp({ op: 'delete', tokens: original.slice(i) });
  }
  if (j < refined.length) {
    pushOp({ op: 'insert', tokens: refined.slice(j) });
  }

  return ops;
};

export const computeChangeHighlights = (
  original: string,
  refined: string,
): ChangeHighlightsResult => {
  const originalTokens = tokenize(original);
  const refinedTokens = tokenize(refined);
  const ops = diffTokens(originalTokens, refinedTokens);

  const segments: RefinedSegment[] = [];
  const changes: ChangeBlock[] = [];

  const pushSegment = (segment: RefinedSegment) => {
    const last = segments[segments.length - 1];
    if (segment.type === 'equal' && last?.type === 'equal') {
      last.text += segment.text;
      return;
    }
    segments.push(segment);
  };

  const renderChangedSegment = (text: string, changeId: string) => {
    if (!text) return;
    if (text.trim().length === 0) {
      pushSegment({ type: 'equal', text });
      return;
    }

    const leadingWhitespace = text.match(/^\s+/)?.[0] ?? '';
    const trailingWhitespace = text.match(/\s+$/)?.[0] ?? '';
    const start = leadingWhitespace.length;
    const end = text.length - trailingWhitespace.length;
    const core = text.slice(start, end);

    if (leadingWhitespace) {
      pushSegment({ type: 'equal', text: leadingWhitespace });
    }

    if (core) {
      pushSegment({ type: 'changed', text: core, changeId });
    }

    if (trailingWhitespace) {
      pushSegment({ type: 'equal', text: trailingWhitespace });
    }
  };

  let pendingDelete: string[] = [];
  let pendingInsert: string[] = [];

  const flushPendingChange = () => {
    if (!pendingDelete.length && !pendingInsert.length) {
      return;
    }

    let kind: ChangeKind;
    if (pendingDelete.length && pendingInsert.length) {
      kind = 'replace';
    } else if (pendingInsert.length) {
      kind = 'insert';
    } else {
      kind = 'delete';
    }

    const changeId = `change-${changes.length + 1}`;
    const beforeText = joinTokens(pendingDelete);
    const afterText = joinTokens(pendingInsert);

    changes.push({
      id: changeId,
      kind,
      beforeText,
      afterText,
    });

    if (kind !== 'delete') {
      renderChangedSegment(afterText, changeId);
    }

    pendingDelete = [];
    pendingInsert = [];
  };

  ops.forEach((op) => {
    if (op.op === 'equal') {
      flushPendingChange();
      pushSegment({ type: 'equal', text: joinTokens(op.tokens) });
      return;
    }

    if (op.op === 'delete') {
      pendingDelete.push(...op.tokens);
      return;
    }

    pendingInsert.push(...op.tokens);
  });

  flushPendingChange();

  return { segments, changes };
};
