import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mango Range Component</h1>
        <p className={styles.description}>
          Custom dual-handle range slider component
        </p>
        
        <div className={styles.cards}>
          <Link href="/exercise1" className={styles.card}>
            <h2>Exercise 1 →</h2>
            <p>Normal Range</p>
            <span className={styles.detail}>Editable values with drag functionality</span>
          </Link>

          <Link href="/exercise2" className={styles.card}>
            <h2>Exercise 2 →</h2>
            <p>Fixed Values Range</p>
            <span className={styles.detail}>Currency values with predefined options</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
