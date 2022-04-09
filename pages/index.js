import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Calendar from '../components/calendar'
import Cal_Block from '../components/calendar'

export default function Home() {
  return (
    <div className={styles.container}>
     
      <Cal_Block  />
    
    </div>
  )
}
