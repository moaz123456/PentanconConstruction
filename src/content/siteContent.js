// Written copy for the static parts of the site (services are static by design; projects, clients
// and testimonials come from the API). This is starter text - replace it with the company's own wording.

export const hero = {
  title: ['Built right.', 'Finished to the last detail.'],
  text: 'Construction and finishing for coastal, residential, commercial and corporate spaces.'
};

export const intro = {
  statement:
    'We take a building from the first foundation to the final coat of paint, and we care as much about the finish as we do about the structure.',
  link: { to: '/about', label: 'About Pentacon' }
};

export const about = {
  statement:
    'Pentacon Construction builds and finishes spaces for people who care about how they turn out.',
  paragraphs: [
    'We work on villas and coastal developments, homes, retail units and offices. Every project has one team accountable for it, from the first site visit to handover, so decisions are made quickly and nothing is lost between trades.',
    'Our crews work to the approved drawings, the agreed budget and the agreed date. When something changes on site, the client hears about it from us first.'
  ],
  values: [
    { title: 'Precision', text: 'Levels, lines and joints are checked before the next trade starts, not after handover.' },
    { title: 'Clear communication', text: 'Regular site updates, photos and written approvals for every change.' },
    { title: 'On-time delivery', text: 'A realistic programme, tracked weekly, with delays reported early.' },
    { title: 'Safe sites', text: 'Trained crews, protective equipment and tidy sites, every day.' }
  ]
};

// icon = name of a lucide-react icon (resolved in src/pages/Services.jsx and the Home services list)
export const services = [
  {
    id: 'construction',
    icon: 'HardHat',
    title: 'General construction',
    summary: 'Structure, masonry and building shells for villas, apartment buildings and commercial units.',
    points: ['Reinforced concrete and masonry', 'Building envelope and facades', 'Site logistics and supervision']
  },
  {
    id: 'finishing',
    icon: 'PaintRoller',
    title: 'Finishing works',
    summary: 'Plaster, flooring, ceilings, paint and joinery finished to the design drawings.',
    points: ['Plaster, paint and wall finishes', 'Flooring, tiling and stone', 'Gypsum ceilings and lighting details']
  },
  {
    id: 'fit-out',
    icon: 'Building2',
    title: 'Interior fit-out',
    summary: 'Offices, showrooms and retail spaces fitted out on a fixed programme.',
    points: ['Partitions, glazing and joinery', 'Reception, meeting and open-plan areas', 'Branding and signage installation']
  },
  {
    id: 'mep',
    icon: 'Zap',
    title: 'MEP coordination',
    summary: 'Mechanical, electrical and plumbing works coordinated with the architecture on site.',
    points: ['Air conditioning and ventilation', 'Power, lighting and low current', 'Water supply and drainage']
  },
  {
    id: 'turnkey',
    icon: 'KeyRound',
    title: 'Turnkey delivery',
    summary: 'One contract and one team, from site handover to move-in day.',
    points: ['Single point of responsibility', 'Fixed scope, budget and date', 'Handover with snag list closed']
  },
  {
    id: 'renovation',
    icon: 'Hammer',
    title: 'Renovation and refurbishment',
    summary: 'Upgrading existing homes, shops and offices with minimum disruption.',
    points: ['Strip-out and structural repairs', 'Phased works in occupied buildings', 'Modernised finishes and services']
  }
];
