import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

const FAQS = [
  {
    question: "Qu’est-ce que le dispositif « Alim&apos;confiance » ?",
    answer: `Depuis le 3 avril 2017, les consommateurs ont accès aux résultats des contrôles sanitaires réalisés dans tous les établissements de la chaîne alimentaire (restaurants, cantines, abattoirs, commerces, etc.). Ce dispositif vise à renforcer la transparence et la confiance des citoyens dans la sécurité sanitaire des aliments.`
  },
  {
    question: "Quels sont les niveaux d&apos;hygiène affichés ?",
    answer: (
      <>
        Il existe quatre niveaux d&apos;hygiène :<br/>
        <strong className="text-green-500">Très satisfaisant</strong> : aucune non-conformité, ou uniquement des non-conformités mineures.<br/>
        <strong className="text-yellow-500">Satisfaisant</strong> : non-conformités ne justifiant pas de mesures de police administrative, mais nécessitant un rappel de la réglementation.<br/>
        <strong className="text-orange-500">À améliorer</strong> : mise en demeure de procéder à des mesures correctives, suivie d&apos;un nouveau contrôle.<br/>
        <strong className="text-red-500">À corriger de manière urgente</strong> : non-conformités susceptibles de mettre en danger la santé du consommateur, pouvant entraîner une fermeture administrative ou un retrait/suspension d&apos;agrément.
      </>
    )
  },
  {
    question: "Quels établissements sont concernés par la publication des résultats ?",
    answer: "Tous les établissements de la chaîne alimentaire sont concernés : abattoirs, commerces de détail (boucheries, restaurants, supermarchés, marchés, vente à la ferme, etc.), restaurants collectifs, établissements agroalimentaires."
  },
  {
    question: "Comment les résultats sont-ils affichés ?",
    answer: "Les établissements de remise directe (restaurants, métiers de bouche, distributeurs) et de restauration collective peuvent afficher sur leur devanture le niveau d&apos;hygiène obtenu. Une affichette officielle leur est transmise par les services départementaux de l&apos;État."
  },
  {
    question: "Pourquoi ce dispositif a-t-il été mis en place ?",
    answer: "La publication des résultats des contrôles sanitaires répond à une attente légitime des citoyens et participe à l&apos;amélioration de la confiance du consommateur. Elle s&apos;inscrit dans une démarche de transparence de l&apos;action de l&apos;État, prévue par la loi d&apos;Avenir pour l&apos;agriculture, l&apos;alimentation et la forêt du 13 octobre 2014."
  },
  {
    question: "Ce système existe-t-il ailleurs en Europe ?",
    answer: "Oui, plusieurs pays européens (Royaume-Uni, Pays-Bas, Belgique, Irlande, Danemark, Finlande, Lituanie, Norvège) publient déjà les résultats de leurs contrôles sanitaires. D&apos;autres, comme l&apos;Allemagne et la Suède, projettent de le faire."
  },
  {
    question: "Où puis-je consulter les résultats ?",
    answer: (
      <>
        Les résultats sont consultables sur la page officielle du Ministère de l&apos;Agriculture :<br/>
        <a href="https://agriculture.gouv.fr/alimconfiance-les-resultats-des-controles-sanitaires-accessibles-tous" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://agriculture.gouv.fr/alimconfiance-les-resultats-des-controles-sanitaires-accessibles-tous</a>
      </>
    )
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-10 pb-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">Questions Fréquentes</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur le dispositif Alim&apos;confiance et la publication des contrôles sanitaires
          </p>
        </div>
        <div className="max-w-3xl mx-auto mb-8">
          <Accordion type="single" collapsible className="space-y-2 py-2">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i+1}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="text-lg font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 