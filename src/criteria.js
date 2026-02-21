export const GRADE_LABELS = {
  1: '1 – Sehr gut',
  2: '2 – Gut',
  3: '3 – Befriedigend',
  4: '4 – Ausreichend',
  5: '5 – Mangelhaft',
  6: '6 – Ungenügend',
};

export const CRITERIA = [
  {
    id: 'arbeitsausfuehrung',
    category: 'Fachkompetenz',
    label: 'Arbeitsausführung',
    description:
      'Qualität und Sorgfalt bei der Ausführung von Arbeitsaufgaben.',
  },
  {
    id: 'lernbereitschaft',
    category: 'Fachkompetenz',
    label: 'Lernbereitschaft',
    description:
      'Motivation und Bereitschaft, Neues zu lernen und Wissen zu erweitern.',
  },
  {
    id: 'arbeitsmethodik',
    category: 'Methodenkompetenz',
    label: 'Arbeitsmethodik',
    description:
      'Planvolles und strukturiertes Vorgehen bei der Bearbeitung von Aufgaben.',
  },
  {
    id: 'ordnung_sauberkeit',
    category: 'Methodenkompetenz',
    label: 'Ordnung und Sauberkeit',
    description: 'Ordentlicher und sauberer Umgang mit dem Arbeitsplatz und Materialien.',
  },
  {
    id: 'teamfaehigkeit',
    category: 'Sozialkompetenz',
    label: 'Teamfähigkeit',
    description: 'Fähigkeit, effektiv im Team zu arbeiten und Kollegen zu unterstützen.',
  },
  {
    id: 'soziales_verhalten',
    category: 'Sozialkompetenz',
    label: 'Soziales Verhalten',
    description:
      'Respektvoller und kooperativer Umgang mit Kollegen, Vorgesetzten und Kunden.',
  },
  {
    id: 'ausdauer',
    category: 'Persönlichkeitskompetenz',
    label: 'Ausdauer',
    description: 'Beharrlichkeit und Durchhaltevermögen auch bei schwierigen Aufgaben.',
  },
  {
    id: 'belastbarkeit',
    category: 'Persönlichkeitskompetenz',
    label: 'Belastbarkeit',
    description: 'Fähigkeit, auch unter Druck und in Stresssituationen ruhig zu bleiben.',
  },
];

export const CATEGORIES = [...new Set(CRITERIA.map((c) => c.category))];
