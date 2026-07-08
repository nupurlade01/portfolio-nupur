import Hero from '../components/Hero';
import About from '../components/About';
import Research from '../components/Research';

const Home = () => {
  return (
    <>
      <Hero />
      <hr className="section-divider" />
      <About />
      <hr className="section-divider" />
      <Research />
    </>
  );
};

export default Home;
