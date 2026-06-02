import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.hero)}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroCopy}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroLead}>
            Bring the SHA-pinning discipline you already apply to GitHub
            Actions to your Neovim plugin specs — with a CLI, a CI action,
            and a Renovate preset that work together as a closed loop.
          </p>
          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/getting-started">
              Get started
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Read the docs
            </Link>
          </div>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.previewLabel}>Before</div>
          <CodeBlock language="lua" className={styles.previewBlock}>
{`{ "ggandor/leap.nvim", tag = "v0.1.5" },
{
  "folke/which-key.nvim",
  branch = "main",
  keys = { "<leader>" },
},`}
          </CodeBlock>
          <div className={styles.previewArrow}>
            <code>vimpin run</code>
          </div>
          <div className={styles.previewLabel}>After (canonical form)</div>
          <CodeBlock language="lua" className={styles.previewBlock}>
{`{ "ggandor/leap.nvim", commit = "8a40d3aa...07b9079b" }, -- tag: v0.1.5
{
  "folke/which-key.nvim",
  commit = "3aab2147...0a44c15a", -- branch: main
  keys = { "<leader>" },
},`}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

type UseCase = {
  title: string;
  body: string;
  link: { to: string; label: string };
};

const useCases: UseCase[] = [
  {
    title: 'Pin once',
    body:
      'Rewrite every existing tag/branch hint into an inline commit pin. ' +
      'No new plugin manager, no extra lockfile — your Lua spec becomes the contract.',
    link: { to: '/docs/vimpin/quickstart', label: 'CLI quickstart' },
  },
  {
    title: 'Audit drift in CI',
    body:
      'Gate every PR on three orthogonal checks: structural validity, ' +
      'canonical form, and SHA ↔ annotation alignment. One workflow, three failure modes.',
    link: { to: '/docs/guides/ci-setup', label: 'CI setup guide' },
  },
  {
    title: 'Auto-update with Renovate',
    body:
      'Let Renovate open PRs that bump the commit hash and the annotation ' +
      'atomically. No more silently rotated tags, no more drift between SHA and version label.',
    link: { to: '/docs/vimpin-renovate-config/overview', label: 'Renovate preset' },
  },
];

function UseCases() {
  return (
    <section className={styles.useCases}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          What vimpin gives you
        </Heading>
        <div className={styles.cardGrid}>
          {useCases.map((uc) => (
            <div key={uc.title} className={styles.card}>
              <Heading as="h3" className={styles.cardTitle}>
                {uc.title}
              </Heading>
              <p className={styles.cardDescription}>{uc.body}</p>
              <Link className={styles.cardLink} to={uc.link.to}>
                {uc.link.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ProductCard = {
  title: string;
  href: string;
  docsHref: string;
  description: string;
};

const products: ProductCard[] = [
  {
    title: 'vimpin',
    href: 'https://github.com/gr1m0h/vimpin',
    docsHref: '/docs/vimpin/overview',
    description:
      'Go CLI that rewrites lazy.nvim Lua specs so every plugin is pinned to a 40-hex commit, with a human-readable tag / branch annotation.',
  },
  {
    title: 'vimpin-action',
    href: 'https://github.com/gr1m0h/vimpin-action',
    docsHref: '/docs/vimpin-action/overview',
    description:
      'GitHub Action wrapper that collapses the install-and-run boilerplate into one step. Versions independently from the CLI.',
  },
  {
    title: 'vimpin-renovate-config',
    href: 'https://github.com/gr1m0h/vimpin-renovate-config',
    docsHref: '/docs/vimpin-renovate-config/overview',
    description:
      'Renovate preset that opens PRs for pinned specs. Updates the commit hash and the annotation atomically — no drift.',
  },
];

function Products() {
  return (
    <section className={styles.products}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          The vimpin family
        </Heading>
        <p className={styles.sectionLead}>
          Three projects, one canonical form. Each can be used standalone,
          but together they form a closed update loop.
        </p>
        <div className={styles.cardGrid}>
          {products.map((p) => (
            <div key={p.title} className={styles.card}>
              <Heading as="h3" className={styles.cardTitle}>
                {p.title}
              </Heading>
              <p className={styles.cardDescription}>{p.description}</p>
              <div className={styles.cardLinks}>
                <Link className="button button--primary button--sm" to={p.docsHref}>
                  Docs
                </Link>
                <Link className="button button--secondary button--sm" href={p.href}>
                  GitHub
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className={clsx('container', styles.ctaContainer)}>
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to pin?
        </Heading>
        <p className={styles.ctaLead}>
          Five-minute tour spanning all three tools. No GitHub App, no
          background daemons, no new plugin manager — just a CLI and a
          canonical spec form.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/guides/supply-chain">
            Read the why
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Pin Vim/Neovim plugin specs to explicit commit hashes."
    >
      <Hero />
      <main>
        <UseCases />
        <Products />
        <CallToAction />
      </main>
    </Layout>
  );
}
