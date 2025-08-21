import React from 'react'
import LoadingImage from '@/assets/loading.jpeg'
import styles from './LoadingScreen.module.scss'

export const LoadingScreen: React.FC = () => {
    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${LoadingImage})`,
            }}
        >
            <div className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.spinner}/>
                    Loading...
                </div>
            </div>
        </div>
    )
}
