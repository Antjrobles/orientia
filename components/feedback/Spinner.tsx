import React from 'react';
import SpinnerSvg from '../../public/spinner.svg';
import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <SpinnerSvg className={styles.spinner} width="48" height="48" />
    </div>
  );
};

export default Spinner;
