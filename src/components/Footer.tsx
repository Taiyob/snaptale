import Image from "next/image";
import styles from "../app/page.module.css";
import React from "react";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <p>© {new Date().getFullYear()} MyGallery. All rights reserved.</p>
        <p>Built with ❤️ using Next.js + Cloudinary</p>
      </div>
      <div className={styles.footerLinks}>
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/github.svg" alt="GitHub icon" width={18} height={18} />
          GitHub
        </a>
        <a
          href="https://yourportfolio.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/globe.svg" alt="Website icon" width={18} height={18} />
          Portfolio
        </a>
        <a
          href="mailto:youremail@example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/email.svg" alt="Email icon" width={18} height={18} />
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
