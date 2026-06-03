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
{`{ "example/example.nvim", tag = "v1.0.0" },`}
          </CodeBlock>
          <div className={styles.previewArrow}>
            <code>vimpin run</code>
          </div>
          <div className={styles.previewLabel}>After</div>
          <CodeBlock language="lua" className={styles.previewBlock}>
{`{ "example/example.nvim", commit = "deadbeef...cafebabe" }, -- tag: v1.0.0`}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

type ProductCard = {
  title: string;
  docsHref: string;
  description: string;
};

const products: ProductCard[] = [
  {
    title: 'vimpin',
    docsHref: '/docs/vimpin/overview',
    description: 'CLI that rewrites lazy.nvim Lua specs to canonical pinned form.',
  },
  {
    title: 'vimpin-action',
    docsHref: '/docs/vimpin-action',
    description: 'GitHub Action wrapper around the CLI.',
  },
  {
    title: 'vimpin-renovate-config',
    docsHref: '/docs/vimpin-renovate-config',
    description: 'Renovate preset that opens update PRs.',
  },
];

function Products() {
  return (
    <section className={styles.products}>
      <div className="container">
        <div className={styles.cardGrid}>
          {products.map((p) => (
            <Link key={p.title} to={p.docsHref} className={styles.card}>
              <Heading as="h3" className={styles.cardTitle}>
                {p.title}
              </Heading>
              <p className={styles.cardDescription}>{p.description}</p>
            </Link>
          ))}
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
        <Products />
      </main>
    </Layout>
  );
}
