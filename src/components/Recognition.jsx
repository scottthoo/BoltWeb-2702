import { motion } from 'framer-motion';
import { SiProducthunt } from 'react-icons/si';

export default function Recognition() {
  return (
    <section id="recognition" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Recognition</h2>
          <p className="text-gray-400">Featured on leading platforms</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
        >
          <SiProducthunt className="text-6xl text-orange-500 mx-auto mb-6" />
          <p className="text-2xl font-bold mb-4">Featured on Product Hunt</p>
          <p className="text-gray-400">
            Recognized for our innovative approach to AI development and user experience design
          </p>
        </motion.div>
      </div>
    </section>
  );
}