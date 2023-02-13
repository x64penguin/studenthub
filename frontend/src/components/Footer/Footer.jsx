import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer__copyright">Copyright &copy; {new Date().getFullYear()} studenthub</p>
            <div className="footer__social-media">
                <a href="https://t.me/x64penguin">Telegram</a>
                <a href="#">VK</a>
                <a href="https://github.com/x64penguin/studenthub">GitHub</a>
            </div>
        </footer>
    );
}

export default Footer;