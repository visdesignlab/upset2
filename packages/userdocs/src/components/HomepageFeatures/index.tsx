import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Images which must be imported as react modules (see import list)
type FeatureImage = {
  title: string;
  src: string;
  alt: string
  description: ReactNode;
  className?: string;
};

// SVGs are dynamically imported as react components
type FeatureSVG = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  className?: string;
}

type FeatureItem = FeatureImage | FeatureSVG;

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/upset-ease-of-use.svg').default,
    className: styles.image3by2,
    description: (
      <>
        UpSet 2 is designed to be simple to use. We provide a modular interface and integrated data upload portal through Multinet.
      </>
    ),
  },
  {
    title: 'Accessible Design',
    Svg: require('@site/static/img/upset-accessible-design.svg').default,
    description: (
      <>
        Many features such as generated text descriptions and data tables are designed to help make UpSet 2 accessible to BLV users and experts.
      </>
    ),
  },
  {
    title: 'Modular React Component',
    Svg: require('@site/static/img/upset_modular_component.svg').default,
    description: (
      <>
        Integrate UpSet 2 as a React component into your own environment. We provide a simple component configuration to allow you to customize the look and possible operations when using UpSet 2.
      </>
    ),
  },
];

function Feature(props: FeatureItem) {
  const { title, description, className } = props;
  const { src, alt } = props as FeatureImage;

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {'src' in props && <img className={`${styles.featureSvg} ${className ?? ''}`} src={src} alt={alt} />}
        {'Svg' in props && <props.Svg className={`${styles.featureSvg} ${className ?? ''}`} role="img" />}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
