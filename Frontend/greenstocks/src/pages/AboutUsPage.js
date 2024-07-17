import React from 'react';
import Header from '../component/Header';

function AboutUsPage() {
    return (
        <div>
        <Header/>
        <div className="AboutUs">
            <section className="about-section">
                <h1>About Our Application</h1>
                <p>Our application helps users analyze ESG (Environmental, Social, Governance) scores and make informed investment decisions.</p>
            </section>

            <section className="esg-section">
                <div className="esg-column">
                    <h2>Environmental</h2>
                    <p>Information about the environmental impact of companies.</p>
                </div>
                <div className="esg-column">
                    <h2>Social</h2>
                    <p>Information about the social impact and practices of companies.</p>
                </div>
                <div className="esg-column">
                    <h2>Governance</h2>
                    <p>Information about the governance practices of companies.</p>
                </div>
            </section>

            <section className="features-section">
                <h2>Features</h2>
                <div className="features-columns">
                    <ul className="features-column">
                        <li>Calculating ESG score</li>
                        <li>Calculating green score</li>
                        <li>Analyzing greenwashing</li>
                    </ul>
                    <ul className="features-column">
                        <li>Recommending stocks</li>
                        <li>Displaying green news</li>
                    </ul>
                </div>
            </section>

            <section className="contact-section">
                <h2>Contact Us</h2>
                <p>Follow us on social media:</p>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </section>
        </div>
       </div>
    );
}

export default AboutUsPage;