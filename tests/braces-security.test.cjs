const assert = require('node:assert/strict');
const test = require('node:test');
const braces = require('braces');

// GHSA-vfj7-8cjw-p6xm: stay below the existing 10,000-character cap.
// A controlled SyntaxError must replace exhaustion of the JavaScript stack.
const nested = (open, close, depth) => open.repeat(depth) + 'a,b' + close.repeat(depth);
for (const [name, pattern] of [
  ['braces', nested('{', '}', 3500)],
  ['parentheses', nested('(', ')', 3500)],
  ['mixed nesting', nested('{(', ')}', 1500)],
]) {
  for (const operation of ['parse', 'compile', 'expand', 'stringify']) {
    test(`${operation} rejects excessive ${name} before stack exhaustion`, () => {
      assert.ok(pattern.length < 10000);
      assert.throws(() => braces[operation](pattern), (error) =>
        error instanceof SyntaxError && /depth/i.test(error.message));
    });
  }
}

for (const operation of ['compile', 'expand', 'stringify']) {
  test(`${operation} also guards caller-provided ASTs`, () => {
    let node = { type: 'text', value: 'a' };
    for (let depth = 0; depth < 3500; depth++) node = { type: 'root', nodes: [node] };
    assert.throws(() => braces[operation](node), (error) =>
      error instanceof SyntaxError && /depth/i.test(error.message));
  });
}

test('ordinary expansion, regex compilation and literal escaping remain compatible', () => {
  assert.deepEqual(braces.expand('docs/{guide,api}/{a,b}.md'), [
    'docs/guide/a.md', 'docs/guide/b.md', 'docs/api/a.md', 'docs/api/b.md',
  ]);
  assert.deepEqual(braces.expand('v{1..3}'), ['v1', 'v2', 'v3']);
  assert.deepEqual(braces.expand('a{b,{c,d}}'), ['ab', 'ac', 'ad']);
  assert.deepEqual(braces.expand('\\{literal\\}'), ['{literal}']);
  const regexp = new RegExp(`^${braces.compile('docs/{guide,api}.md')}$`);
  assert.ok(regexp.test('docs/api.md'));
  assert.ok(!regexp.test('docs/other.md'));
  assert.equal(braces.stringify(braces.parse('a/{b,c}')), 'a/{b,c}');
  assert.deepEqual(braces.expand('x'.repeat(1000)), ['x'.repeat(1000)]);
});

test('Docusaurus micromatch path matching remains compatible', () => {
  const micromatch = require('micromatch');
  assert.deepEqual(micromatch(['docs/a.md', 'docs/b.mdx', 'docs/c.txt'], 'docs/*.{md,mdx}'),
    ['docs/a.md', 'docs/b.mdx']);
  assert.deepEqual(micromatch.braceExpand('docs/{a,b}.md'), ['docs/a.md', 'docs/b.md']);
});

test('the reviewed fork is used instead of the vulnerable upstream package', () => {
  const pkg = require('braces/package.json');
  assert.equal(pkg.name, '@bleedingdev/braces');
  assert.equal(pkg.version, '3.0.4');
});

test('Chokidar still watches brace-glob paths used by the development server', { timeout: 10000 }, async () => {
  const fs = require('node:fs/promises');
  const os = require('node:os');
  const path = require('node:path');
  const chokidar = require('chokidar');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-braces-watch-'));
  const target = path.join(root, 'article.mdx');
  const watcher = chokidar.watch(path.join(root, '*.{md,mdx}'), {
    ignoreInitial: true,
    usePolling: true, // Test glob expansion independently of the host's native event backend.
    interval: 25,
  });
  try {
    await new Promise((resolve, reject) => {
      watcher.once('ready', resolve);
      watcher.once('error', reject);
    });
    const detected = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('watcher did not detect the MDX file')), 5000);
      watcher.on('add', (file) => {
        if (file === target) { clearTimeout(timer); resolve(); }
      });
      watcher.once('error', (error) => { clearTimeout(timer); reject(error); });
    });
    await fs.writeFile(target, '# Example\n');
    await detected;
  } finally {
    await watcher.close();
    await fs.rm(root, { recursive: true, force: true });
  }
});
