import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : 19 mai 2026</p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                Chez Trevi Car Rental, nous accordons une importance primordiale à la confidentialité et à la protection de vos données personnelles. Cette politique décrit la manière dont nous collectons, utilisons, stockons et protégeons les informations que vous nous fournissez lorsque vous utilisez notre site web et nos services de location de voiture à Casablanca et partout au Maroc.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">2. Données que nous collectons</h2>
              <p>
                Lorsque vous effectuez une demande de réservation via notre formulaire ou en nous contactant, nous pouvons collecter les informations suivantes :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nom complet</li>
                <li>Numéro de téléphone (notamment pour la communication via WhatsApp)</li>
                <li>Détails sur la réservation (dates de départ/retour, ville de livraison, véhicule choisi)</li>
                <li>Documents légaux requis lors de la signature du contrat physique (permis de conduire, carte d'identité ou passeport)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">3. Utilisation de vos données</h2>
              <p>
                Vos informations personnelles sont uniquement utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Traiter vos demandes de réservation et générer vos devis de location.</li>
                <li>Communiquer avec vous concernant votre réservation ou répondre à vos questions.</li>
                <li>Établir le contrat officiel de location de véhicule lors de la remise des clés.</li>
                <li>Assurer la sécurité de notre flotte de véhicules.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">4. Conservation et Protection des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité rigoureuses pour protéger vos données contre tout accès non autorisé, altération ou divulgation. Vos informations ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales. Elles sont conservées uniquement pendant la durée légale nécessaire au traitement de vos locations de voiture.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">5. Vos Droits</h2>
              <p>
                Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition aux données vous concernant. Vous pouvez exercer ce droit à tout moment en nous contactant par e-mail à : <strong>Trevirentcar@gmail.com</strong>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
