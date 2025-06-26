 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

const HygieneLevels = () => {

    const description = 'Il existe quatre niveaux d\'hygiène :'

    const levels = [
        {
            level: 'Très satisfaisant',
            color: 'text-green-500',
            description: 'Aucune non-conformité, ou uniquement des non-conformités mineures.'
        },
        {
            level: 'Satisfaisant',
            color: 'text-yellow-500',
            description: 'Non-conformités ne justifiant pas de mesures de police administrative, mais nécessitant un rappel de la réglementation.'
        },
        {
            level: 'À améliorer',
            color: 'text-orange-500',
            description: 'Mise en demeure de procéder à des mesures correctives, suivie d\'un nouveau contrôle.'
        },
        {
            level: 'À corriger de manière urgente',
            color: 'text-red-500',
            description: 'Non-conformités susceptibles de mettre en danger la santé du consommateur, pouvant entraîner une fermeture administrative ou un retrait/suspension d\'agrément.'
        }
    ]
  return (
    <>
      {description}<br />
     {levels.map((level) => (
        <div key={level.level}>
            <strong className={level.color}>{level.level}</strong> : {level.description}<br />
        </div>
     ))}
    </>
  )
}

function FaqLink() {
    const link = 'https://agriculture.gouv.fr/alimconfiance-les-resultats-des-controles-sanitaires-accessibles-tous'
    const linkText = 'https://agriculture.gouv.fr'


   const description = `Les résultats sont consultables sur la page officielle du Ministère de l'Agriculture `
  return (
    <>
      {description}
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary underline">{linkText}</a>
    </>
  )
}

const FAQS = [
  {
    question: "Qu'est-ce que le dispositif « Alim'confiance » ?",
    answer: "Depuis le 3 avril 2017, les consommateurs ont accès aux résultats des contrôles sanitaires réalisés dans tous les établissements de la chaîne alimentaire (restaurants, cantines, abattoirs, commerces, etc.). Ce dispositif vise à renforcer la transparence et la confiance des citoyens dans la sécurité sanitaire des aliments."
  },
  {
    question: "Quels sont les niveaux d'hygiène affichés ?",
    answer: HygieneLevels
  },
  {
    question: "Quels établissements sont concernés par la publication des résultats ?",
    answer: "Tous les établissements de la chaîne alimentaire sont concernés : abattoirs, commerces de détail (boucheries, restaurants, supermarchés, marchés, vente à la ferme, etc.), restaurants collectifs, établissements agroalimentaires."
  },
  {
    question: "Comment les résultats sont-ils affichés ?",
    answer: "Les établissements de remise directe (restaurants, métiers de bouche, distributeurs) et de restauration collective peuvent afficher sur leur devanture le niveau d'hygiène obtenu. Une affichette officielle leur est transmise par les services départementaux de l'État."
  },
  {
    question: "Pourquoi ce dispositif a-t-il été mis en place ?",
    answer: "La publication des résultats des contrôles sanitaires répond à une attente légitime des citoyens et participe à l'amélioration de la confiance du consommateur. Elle s'inscrit dans une démarche de transparence de l'action de l'État, prévue par la loi d'Avenir pour l'agriculture, l'alimentation et la forêt du 13 octobre 2014."
  },
  {
    question: "Ce système existe-t-il ailleurs en Europe ?",
    answer: "Oui, plusieurs pays européens (Royaume-Uni, Pays-Bas, Belgique, Irlande, Danemark, Finlande, Lituanie, Norvège) publient déjà les résultats de leurs contrôles sanitaires. D'autres, comme l'Allemagne et la Suède, projettent de le faire."
  },
  {
    question: "Où puis-je consulter les résultats ?",
    answer: FaqLink
  }
]

export function FAQSection() {
    const title = 'Questions Fréquentes'
    const description = 'Tout ce que vous devez savoir sur le dispositif Alim\'confiance et la publication des contrôles sanitaires'
  return (
    <section id="faq" className="py-10 pb-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
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
                  {typeof faq.answer === 'string' ? (
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  ) : (
                    <div className="text-muted-foreground leading-relaxed">{faq.answer()}</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 