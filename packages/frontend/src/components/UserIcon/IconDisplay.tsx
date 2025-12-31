import { useMemo } from 'react';
import { useAuthStore } from '@/domains/auth';
import userIconList from './constants';
import styles from './styles.module.css';

interface IconDisplayProps {
  className?: string;
  size?: number;
  forceIcon?: string;
}

export const IconDisplay = ({ className = '', size = 40, forceIcon }: IconDisplayProps) => {
  const { user } = useAuthStore();
  const iconName = forceIcon || user?.icon || userIconList[0].name;

  const iconData = useMemo(() => {
    return userIconList.find((item) => item.name === iconName) || userIconList[0];
  }, [iconName]);

  return (
    <img
      src={iconData.base64}
      alt={iconName}
      className={`${styles.iconBase} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
