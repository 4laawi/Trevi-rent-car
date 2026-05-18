import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : 19 mai 2026</p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">1. Objet du Contrat</h2>
              <p>
                Les présentes Conditions Générales régissent la location de véhicules proposée par l'agence Trevi Car Rental à Casablanca, Maroc. En soumettant une demande de réservation sur notre site web, vous acceptez pleinement ces conditions de location.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">2. Conditions d'Éligibilité du Conducteur</h2>
              <p>
                Pour pouvoir louer un véhicule chez Trevi Car Rental, le conducteur principal ainsi que tout conducteur additionnel doivent remplir les critères obligatoires suivants :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Avoir un âge minimum de 21 ans (certains véhicules de gamme supérieure peuvent requérir 23 ou 25 ans).</li>
                <li>Être titulaire d'un permis de conduire valide depuis au moins 2 ans.</li>
                <li>Présenter une pièce d'identité originale en cours de validité (carte d'identité nationale pour les résidents, passeport pour les non-résidents).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">3. Réservation et Tarifs</h2>
              <p>
                Les tarifs de location sont indiqués en Dirham Marocain (MAD) par jour (tranche de 24h). Notre site web calcule des estimations en fonction des dates sélectionnées et des tarifs de base ou promotionnels en cours.
              </p>
              <p className="mt-2">
                Toute demande effectuée en ligne constitue une pré-réservation qui sera confirmée de manière définitive par nos conseillers par téléphone ou via WhatsApp. Le paiement s'effectue généralement lors de la livraison et de la remise des clés du véhicule.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">4. Utilisation du Véhicule et Carburant</h2>
              <p>
                Le locataire s'engage à utiliser le véhicule loué de manière prudente, responsable et conforme au code de la route marocain. Le véhicule doit être restitué dans le même état qu'à la livraison, avec le même niveau de carburant qu'au départ. Tout dommage résultant d'une négligence manifeste ou d'une conduite hors route non autorisée sera à la charge exclusive du locataire.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">5. Assurances et Franchise</h2>
              <p>
                Tous nos véhicules font l'objet d'une assurance tout risque assortie d'une franchise de minimum 5% de la valeur du préjudice en cas d'accident responsable. En cas de vol ou de sinistre, le locataire est tenu de fournir un rapport de police ou un constat à l'amiable dûment complété dans les 24 heures sous peine de déchéance des garanties d'assurance.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
