import { ReactNode } from 'react';
import styles from './LandingLayout.module.css';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
           <BannerNegative/>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        {children}
      </div>
    </div>
  );
};

export default LandingLayout;